import IModel from "../../common/IModel.interface";
import PizzaModel from "../pizza/model";
import UserModel from "../user/model";

export type OrderStatus = "rejected" | "pending" | "delivered";

export interface CartItemModel {
    pizzaId: number,
    pizza?: PizzaModel,
    quantity: number,
    size: PizzaSize
}

export interface CartModel {
    cartItems: CartItemModel[],
    comment: string
}


export type PizzaSize = 'small' | 'medium' | 'large';
export default class OrderModel implements IModel{
    orderId: number;
    cartItems: CartItemModel[];
    comment: string;
    status: OrderStatus;
    user: UserModel;
}