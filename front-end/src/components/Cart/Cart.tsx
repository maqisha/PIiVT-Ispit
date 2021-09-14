import './Cart.scss';
import { useEffect, useState } from "react"
import EventRegister from "../../api/EventRegister"
import CartService, { CartModel } from "../../services/CartService"
import CartItem from "./CartItem"
import { Button } from '@material-ui/core';

const Cart = () => {
    const [cart, setCart] = useState<CartModel>({ cartItems: [] })

    const handleCartEvent = (status: string, data: any) => {
        if (status == "cart_changed") {
            setCart(CartService.getCart())
        }
    }

    useEffect(() => {
        EventRegister.on("CART_EVENT", handleCartEvent);

        setCart(CartService.getCart())

        return () => {
            EventRegister.off("CART_EVENT", handleCartEvent);
        }
    }, [])
    return (
        <div className="cart">
            <div className="cartItems">
                {cart.cartItems.map(cartItem => (<CartItem key={cartItem.pizza.pizzaId} cartItem={cartItem} />))}
            </div>
            <Button>Order</Button>
        </div>

    )
}

export default Cart
