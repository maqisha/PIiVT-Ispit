import BaseService from "../../common/BaseService";
import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PizzaModel from "../pizza/model";
import UserModel from "../user/model";
import OrderModel, { CartItemModel, CartModel } from "./model";

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
            order.cartItems = await this.getPizzaOrdersByOrderId(order.orderId) as CartItemModel[];

        return order;
    }

    private async getPizzaOrdersByOrderId(orderId: number): Promise<CartItemModel[] | IErrorResponse> {
        return new Promise<CartItemModel[] | IErrorResponse>(resolve => {
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
                    const list: CartItemModel[] = [];

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
        return await this.getAllFromTable("order", options);
    }

    public async getById(orderId: number, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel | null | IErrorResponse> {
        return await this.getByIdFromTable("order", orderId, options);
    }

    public async getByUserId(userId: number, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel[] | null | IErrorResponse> {
        return await this.getAllByFieldNameFromTable("order", "user_id", userId, options);
    }

    public add(userId: number, data: CartModel, options: Partial<OrderModelAdapterOptions> = {}): Promise<OrderModel | null | IErrorResponse> {
        return new Promise<OrderModel | null | IErrorResponse>(resolve => {
            this.db.beginTransaction()
                .then(() => {
                    const sql = "INSERT \`order\` SET \`status\` = ?, user_id = ?, \`comment\` = ?;";
                    this.db.execute(sql, ["pending", userId, data.comment ?? ""])
                        .then(async (result: any) => {
                            const newOrderId: number = +(result[0]?.insertId);
                            const promises = [];

                            for (const cartItem of data.cartItems) {
                                promises.push(
                                    this.db.execute(
                                        'INSERT \`order_pizza\` SET pizza_id = ?, \`order_id\` = ?, quantity = ?, \`size\` = ?;',
                                        [cartItem.pizza.pizzaId, newOrderId, cartItem.quantity, cartItem.size]
                                    )
                                )
                            }

                            Promise.all(promises)
                                .then(async () => {
                                    await this.db.commit();

                                    resolve(await this.getById(newOrderId, {}));
                                })
                        })
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

}

export default OrderService;