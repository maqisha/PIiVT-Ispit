import IngredientService from "../components/ingredient/service";
import PizzaService from "../components/pizza/service";

export default interface IServices {
    pizzaService: PizzaService;
    ingredientService: IngredientService;
}