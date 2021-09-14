import './PizzaPage.scss';
import { useEffect, useState } from "react"
import PizzaItem from "./PizzaItem"
import PizzaModel from "../../../../back-end/src/components/pizza/model"
import PizzaService from "../../services/PizzaService"

interface PizzaPageProperties {
    authorizedRole: 'visitor' | 'user' | 'administrator';
}
const PizzaPage = (props: PizzaPageProperties) => {
    const [pizzas, setPizzas] = useState<PizzaModel[]>([]);

    useEffect(() => {
        PizzaService.getAll()
            .then(pizzas => {
                if (Array.isArray(pizzas) && pizzas.length > 0)
                    setPizzas(pizzas);
            })
    }, [])

    return (
        <div className="pizza-page">
            {pizzas.map(pizza => <PizzaItem key={pizza.pizzaId} pizza={pizza} authorizedRole={props.authorizedRole}/>)}
        </div>
    )
}

export default PizzaPage
