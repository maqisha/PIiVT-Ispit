import PizzaModel from "../../../back-end/src/components/pizza/model";
import api from "../api/api";
import EventRegister from "../api/EventRegister";

export interface CartItemModel {
    pizzaId: number,
    pizza: PizzaModel,
    quantity: number,
    size: PizzaSize
}

export interface CartModel {
    cartItems: CartItemModel[],
    comment: string
}

export type PizzaSize = 'small' | 'medium' | 'large';

export default class CartService {
    public static sendOrder(cart: CartModel) {
        api('post', '/order', cart, true)
            .then(res => {
                if (res.status === "ok") {
                    localStorage.setItem("cart", "{ \"cartItems\": [], \"comment\": \"\" }")
                    EventRegister.emit("CART_EVENT", "cart_changed")
                }
            }).catch(error => {
                localStorage.setItem("cart", "{ \"cartItems\": [], \"comment\": \"\" }")
                EventRegister.emit("CART_EVENT", "cart_changed")
            })
    }

    public static add(pizza: PizzaModel, quantity: number, size: PizzaSize) {
        try {
            const cart: CartModel = CartService.getCart();

            const existing = cart.cartItems.find(cartItem => cartItem.pizza.pizzaId === pizza.pizzaId && cartItem.size === size);

            if (existing) {
                const index = cart.cartItems.indexOf(existing);
                cart.cartItems[index].quantity += quantity;
                cart.cartItems[index].size = size;
                if (cart.cartItems[index].quantity <= 0) cart.cartItems.splice(index, 1);
            } else {
                cart.cartItems.push({ pizzaId: pizza.pizzaId, pizza, quantity, size });
            }


            localStorage.setItem("cart", JSON.stringify(cart));
            EventRegister.emit("CART_EVENT", "cart_changed")
        } catch (error) {
            localStorage.setItem("cart", "{ \"cartItems\": [], \"comment\": \"\" }")
            EventRegister.emit("CART_EVENT", "cart_changed")
        }
    }

    public static getCart(): CartModel {
        return JSON.parse(localStorage.getItem("cart") ?? "{ \"cartItems\": [], \"comment\": \"\" }");
    }

    public static getCartItemPrice(pizza: PizzaModel, quantity: number, size: PizzaSize): number {
        let multiplier: number = 1.0;
        if (size === 'large') multiplier = 1.2;
        if (size === 'small') multiplier = 0.9;

        return (pizza.price * multiplier) * quantity;
    }
}