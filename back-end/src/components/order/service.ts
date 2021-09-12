import BaseService from "../../common/BaseService";
import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IAdaptModelOptionsInterface from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PizzaModel from "../pizza/model";
import UserModel from "../user/model";
import OrderModel, { PizzaOrder } from "./model";

class OrderModelAdapterOptions implements IAdaptModelOptions {
    loadPizzaOrders: boolean = false;
    loadUser: boolean = false;
}

class OrderService extends BaseService<OrderModel> {
    protected async adaptModel(data: any, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel> {
        const order = new OrderModel();

        order.orderId = +(data?.order_id)
        order.comment = data?.comment
        order.status = data?.status

        if (options.loadPizzaOrders)
            order.user = await this.services.userService.getById(data?.user_id) as UserModel;

        if (options.loadUser)
            order.pizzaOrders = await this.getPizzaOrdersByOrderId(order.orderId) as PizzaOrder[];

        return order;
    }

    private async getPizzaOrdersByOrderId(orderId: number): Promise<PizzaOrder[] | IErrorResponse> {
        return new Promise<PizzaOrder[] | IErrorResponse>(resolve => {
            this.db.execute(
                `SELECT
                    pizza.pizza_id,
                    order_pizza.quantity,
                    order_pizza.size
                FROM
                    order_pizza
                INNER JOIN pizza
                ON order_pizza.pizza_id = pizza.pizza_id
                WHERE order_pizza.order_id = ?;`,
                [orderId]
            )
                .then(async result => {
                    const [rows] = result as any;
                    const list: PizzaOrder[] = [];

                    if (Array.isArray(rows) && rows.length > 0) {
                        for (const row of rows) {
                            list.push({
                                pizzaId: row?.pizza_id,
                                quantity: row?.quantity,
                                size: row?.size,
                                pizza: await this.services.pizzaService.getById(row?.pizza_id) as PizzaModel
                            })
                        };
                    }

                    resolve(list);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })
        })
    }

    public async getAll(options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel[] | null | IErrorResponse> {
        return await this.getAllFromTable("\`order\`", options);
    }

    public async getById(orderId: number, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel | null | IErrorResponse> {
        return await this.getByIdFromTable("\`order\`", orderId, options);
    }

    public async getByUserId(userId: number, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel[] | null | IErrorResponse> {
        return await this.getAllByFieldNameFromTable("\`order\`", "user_id", userId, options);
    }

}

export default OrderService;