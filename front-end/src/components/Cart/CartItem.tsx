import './CartItem.scss';
import CartService, { CartItemModel } from "../../services/CartService"
import { IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

interface CartItemProperties {
    cartItem: CartItemModel
}

const CartItem = (props: CartItemProperties) => {
    const updateCart = (quantityDiff: number) => {
        CartService.add(props.cartItem.pizza, quantityDiff, props.cartItem.size);
    }
    return (
        <div className="cartItem">
            <div className="content">
                <div className="name-size">
                    <div>{props.cartItem.quantity} x {props.cartItem.pizza.name}</div>
                    <div>Size: {props.cartItem.size}</div>
                </div>
                <div className="price">{CartService.getCartItemPrice(props.cartItem.pizza, props.cartItem.quantity, props.cartItem.size)}$</div>
            </div>
            <div className="actions">
                <IconButton aria-label="add" onClick={(e) => updateCart(1)} className="button">
                    <AddCircleIcon />
                </IconButton>

                <IconButton aria-label="remove" onClick={(e) => updateCart(-1)} className="button">
                    <RemoveCircleIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default CartItem
