import './PizzaItem.scss';
import PizzaModel from "../../../../back-end/src/components/pizza/model"
import { Button, FormControl, Select, MenuItem, FormHelperText } from '@material-ui/core'
import AppConfig from '../../config/app.config';
import CartService, { PizzaSize } from "../../services/CartService";
import { useState } from "react";

interface PizzaItemProperties {
    pizza: PizzaModel
}


const PizzaItem = (props: PizzaItemProperties) => {
    const [size, setSize] = useState<PizzaSize>('medium');

    const addToCart = () => {
        CartService.add(props.pizza, 1, size);
    }

    const getSmallImage = (): string => {
        if (props.pizza.imagePath) {
            let [path, extension] = props.pizza.imagePath.split('.');
            path = `${path}-small`;

            return AppConfig.UPLOAD_PATH + path + "." + extension;
        }

        return "";
    }

    return (
        <div className="pizza">
            <img src={getSmallImage()} />

            <div className="content">
                <h4 >{props.pizza.name}</h4>
                <p>
                    {
                        props.pizza.ingredients.map(ingredient => (
                            <span key={ingredient.ingredientId}>{ingredient.name + ", "}</span>
                        ))
                    }
                </p>
            </div>
            <div className="size-price">
                <FormControl className="size" variant="outlined">
                    <Select
                        color="secondary"
                        value={size}
                        onChange={e => setSize(e.target.value as PizzaSize)}
                        inputProps={{
                            name: 'Size',
                            id: 'pizza-size',
                        }}
                    >
                        <MenuItem value={'small'}>Small</MenuItem>
                        <MenuItem value={'medium'}>Medium</MenuItem>
                        <MenuItem value={'large'}>Large</MenuItem>
                    </Select>
                    {/* <FormHelperText>Size</FormHelperText> */}
                </FormControl>
                <div className="price">{CartService.getCartItemPrice(props.pizza, 1, size)}$</div>
            </div>
            <Button color="secondary" variant="contained" className="order" onClick={addToCart}>Order</Button>
        </div>
    )
}

export default PizzaItem
