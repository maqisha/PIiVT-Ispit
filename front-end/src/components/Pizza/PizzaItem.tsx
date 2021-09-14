import './PizzaItem.scss';
import PizzaModel from "../../../../back-end/src/components/pizza/model"
import { Button, FormControl, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'
import AppConfig from '../../config/app.config';
import CartService, { PizzaSize } from "../../services/CartService";
import React, { useState } from "react";
import PizzaService, { IEditData } from '../../services/PizzaService';
import { apiAsForm } from '../../api/api';

interface PizzaItemProperties {
    pizza: PizzaModel,
    authorizedRole: 'visitor' | 'user' | 'administrator';
}


const PizzaItem = (props: PizzaItemProperties) => {
    const [size, setSize] = useState<PizzaSize>('medium');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [pizza, setPizza] = useState<PizzaModel>(props.pizza);
    const [file, setFile] = useState<File | undefined>();

    const addToCart = () => {
        CartService.add(pizza, 1, size);
    }

    const handleEdit = () => {
        const data: IEditData = {
            file,
            ingredientIds: [1,2,3],
            name: pizza.name,
            pizzaId: pizza.pizzaId,
            price: pizza.price
        }
        
        PizzaService.edit(data);
        setOpenDialog(false);
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e !== null && e.target !== null) {
            setFile(e.target.files![0]);
        }
    }

    const getSmallImage = (): string => {
        if (pizza.imagePath) {
            let [path, extension] = pizza.imagePath.split('.');
            path = `${path}-small`;

            return AppConfig.UPLOAD_PATH + path + "." + extension;
        }

        return "";
    }

    return (
        <div className="pizza">
            {
                props.authorizedRole === 'administrator' ?
                    (<Button color="primary" variant="contained" className="edit" onClick={() => setOpenDialog(true)}>Edit</Button>) : ""
            }

            <img src={getSmallImage()} />

            <div className="content">
                <h4 >{pizza.name}</h4>
                <p>
                    {
                        pizza.ingredients.map(ingredient => (
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
                <div className="price">${CartService.getCartItemPrice(pizza, 1, size)}</div>
            </div>
            <Button color="secondary" variant="contained" className="order" onClick={addToCart}>Order</Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={pizza.name}
                        onChange={e=>setPizza({...pizza, name: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={pizza.price}
                        onChange={e=>setPizza({...pizza, price: +(e.target.value)})}
                    />
                    <input type="file" onChange={e => handleFile(e)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEdit} color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PizzaItem
