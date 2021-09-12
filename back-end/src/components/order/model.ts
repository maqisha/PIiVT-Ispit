import IModel from "../../common/IModel.interface";
import PizzaModel from "../pizza/model";
import UserModel from "../user/model";

type PizzaSize = "small" | "medium" | "large";
type OrderStatus = "rejected" | "pending" | "delivered";

interface PizzaOrder {
    pizzaId: number,
    pizza?: PizzaModel,
    quantity: number,
    size: PizzaSize,
}

export default class OrderModel implements IModel{
    orderId: number;
    pizzaOrders: PizzaOrder[];
    comment: string;
    status: OrderStatus;
    user: UserModel;
}

export { PizzaOrder, PizzaSize }