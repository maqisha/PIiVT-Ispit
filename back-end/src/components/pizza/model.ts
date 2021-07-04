import IModel from "../../common/IModel.interface";
import IngredientModel from "../ingredient/model";

export default class PizzaModel implements IModel {
    pizzaId: number;
    name: string;
    price: number;
    isActive: boolean;
    imagePath: string | null = null;
    ingredients: IngredientModel[] = [];
}