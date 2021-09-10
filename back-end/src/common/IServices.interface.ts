import IngredientService from "../components/ingredient/service";
import PizzaService from "../components/pizza/service";
import UserService from "../components/user/service";

export default interface IServices {
    pizzaService: PizzaService;
    ingredientService: IngredientService;
    userService: UserService;
}