import PizzaModel from "../../../../back-end/src/components/pizza/model"
import { Button, Card, CardMedia, CardContent } from '@material-ui/core'

interface PizzaItemProperties {
    pizza: PizzaModel
}

const PizzaItem = (props: PizzaItemProperties) => {
    return (
        <Card className="Pizza">
            <CardMedia
                image={"http://localhost:42051/" + props.pizza.imagePath as string}
                title="Contemplative Reptile"
            />
            <CardContent>
                <h4>{props.pizza.name}</h4>
                <p><strong>Price:</strong>{props.pizza.price}</p>
                <p>
                    {
                        props.pizza.ingredients.map(ingredient => (
                            <span key={ingredient.ingredientId}>{ingredient.name + ", "}</span>
                        ))
                    }
                </p>
            </CardContent>
            <Button color="primary">Order</Button>
        </Card>
    )
}

export default PizzaItem
