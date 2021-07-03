import IngredientModel from "../ingredient/model";

export default class PizzaModel {
    pizzaId: number;
    name: string;
    price: number;
    isActive: boolean;
    imagePath: string | null = null;
    ingredients: IngredientModel[] = [];
}