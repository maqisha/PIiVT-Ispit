import PizzaModel from "../../../../back-end/src/components/pizza/model"
import { Button, Card, CardMedia, CardContent, Typography } from '@material-ui/core'
import AppConfig from '../../config/app.config';
import { makeStyles } from '@material-ui/core/styles';
import { classicNameResolver } from "typescript";

interface PizzaItemProperties {
    pizza: PizzaModel
}

const useStyles = makeStyles({
    media: {
        height: 140,
    },
});

const PizzaItem = (props: PizzaItemProperties) => {
    const classes = useStyles();

    return (
        <Card className="Pizza">
            <CardMedia
                className={classes.media}
            image={AppConfig.UPLOAD_PATH + props.pizza.imagePath as string}
            title="Contemplative Reptile"
            />

            <CardContent>
                <Typography variant="h4" >{props.pizza.name}</Typography>
                <Typography paragraph><strong>Price:</strong>{props.pizza.price}</Typography>
                <Typography paragraph>
                    {
                        props.pizza.ingredients.map(ingredient => (
                            <span key={ingredient.ingredientId}>{ingredient.name + ", "}</span>
                        ))
                    }
                </Typography>
            </CardContent>
            <Button color="primary">Order</Button>
        </Card>
    )
}

export default PizzaItem
