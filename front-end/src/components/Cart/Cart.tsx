import './Cart.scss';
import { useEffect, useState } from "react"
import EventRegister from "../../api/EventRegister"
import CartService, { CartModel } from "../../services/CartService"
import CartItem from "./CartItem"
import { Button, TextField } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

const Cart = () => {
    const [cart, setCart] = useState<CartModel>({ cartItems: [], comment: "" })
    const [authorizedRole, setAuthorizedRole] = useState<'visitor' | 'user' | 'administrator'>('visitor');

    const handleCartEvent = (status: string, data: any) => {
        if (status === "cart_changed") {
            setCart(CartService.getCart())
        }
    }

    const handleAuthEvent = (message: string) => {
        if (message === "force_login" || message === "user_logout") {
            return setAuthorizedRole('visitor');
        }

        if (message === "user_login") {
            return setAuthorizedRole('user');
        }

        if (message === "administrator_login") {
            return setAuthorizedRole('administrator');
        }
    }


    const order = () => {
        CartService.sendOrder(cart);
    }

    useEffect(() => {
        EventRegister.on("CART_EVENT", handleCartEvent);
        EventRegister.on("AUTH_EVENT", handleAuthEvent);

        setCart(CartService.getCart())

        return () => {
            EventRegister.off("AUTH_EVENT", handleAuthEvent);
            EventRegister.off("CART_EVENT", handleCartEvent);
        }
    }, [])

    if (authorizedRole === 'visitor') return (<div></div>)

    return (
        <div className="cart">
            <ShoppingCartOutlinedIcon className="cart-icon" />
            <div className="cartItems">
                {cart.cartItems.map(cartItem => (<CartItem key={cartItem.size + cartItem.pizza.pizzaId} cartItem={cartItem} />))}
            </div>
            <TextField
                id="comment"
                multiline
                rows={4}
                value={cart.comment}
                onChange={e => setCart({ cartItems: cart.cartItems, comment: e.target.value })}
                placeholder="Leave a comment"
            />
            <Button variant="contained" color="secondary" className="order" onClick={order} disabled={cart.cartItems.length === 0}>Order</Button>
        </div >

    )
}

export default Cart
