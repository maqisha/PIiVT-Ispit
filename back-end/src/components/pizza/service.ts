import * as mysql2 from "mysql2/promise";
import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { IAddPizza } from "./dto/AddPizza";
import PizzaModel from "./model";

export default class PizzaService extends BaseService<PizzaModel>{
    protected async adaptModel(row: any, options: Partial<IAdaptModelOptions> = { loadIngredients: true }): Promise<PizzaModel> {
        const pizza: PizzaModel = new PizzaModel();

        pizza.pizzaId = +(row?.pizza_id);
        pizza.name = row?.name;
        pizza.imagePath = row?.image_path;
        pizza.price = +(row?.price);
        pizza.isActive = !!(row?.is_active);
        pizza.ingredients = [];

        if (options.loadIngredients) {
            //.....
        }

        return pizza;
    }

    public async getAll(): Promise<PizzaModel[] | null | IErrorResponse> {
        return await this.getAllFromTable("pizza", { loadIngredients: true });
    }

    public async getById(pizzaId: number): Promise<PizzaModel | null | IErrorResponse> {
        return await this.getByIdFromTable("pizza", pizzaId, { loadIngredients: true });
    }

    public async add(data: IAddPizza): Promise<PizzaModel | IErrorResponse> {
        return new Promise<PizzaModel | IErrorResponse>(async resolve => {
            const sql = "INSERT pizza SET name = ?, image_path = ?, price = ?;";

            this.db.execute(sql, [data.name, data.imagePath, data.price])
                .then(async result => {
                    const insertInfo: any = result[0];

                    const newPizzaId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newPizzaId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    })
                });
        })
    }
}