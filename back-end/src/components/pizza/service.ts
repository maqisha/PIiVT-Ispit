import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../services/BaseService";
import { IAddPizza } from "./dto/AddPizza";
import { IEditPizza } from "./dto/EditPizza";
import PizzaModel from "./model";

class PizzaModelAdapterOptions implements IAdaptModelOptions {
    loadIngredients: boolean = false;
}

export default class PizzaService extends BaseService<PizzaModel>{
    protected async adaptModel(row: any, options: Partial<PizzaModelAdapterOptions> = {}): Promise<PizzaModel> {
        const pizza: PizzaModel = new PizzaModel();

        pizza.pizzaId = +(row?.pizza_id);
        pizza.name = row?.name;
        pizza.imagePath = row?.image_path;
        pizza.price = +(row?.price);
        pizza.isActive = !!(row?.is_active);


        // if (options.loadIngredients) {
        //     pizza.ingredients = [];
        // }

        return pizza;
    }

    public async getAll(): Promise<PizzaModel[] | null | IErrorResponse> {
        return await this.getAllFromTable<PizzaModelAdapterOptions>("pizza");
    }

    public async getById(pizzaId: number): Promise<PizzaModel | null | IErrorResponse> {
        return await this.getByIdFromTable<PizzaModelAdapterOptions>("pizza", pizzaId);
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

    public async edit(data: IEditPizza, pizzaId: number): Promise<PizzaModel | null | IErrorResponse> {
        return new Promise<PizzaModel | null | IErrorResponse>(async resolve => {
            const oldPizza = await this.getById(pizzaId);

            if (oldPizza === null) {
                resolve(null);
                return null;
            }

            if (!(oldPizza instanceof PizzaModel)) {
                return oldPizza;
            }

            const sql = "UPDATE pizza SET name = ?, image_path = ?, price = ? WHERE pizza_id = ?;";

            this.db.execute(sql, [data.name, data.imagePath, data.price, pizzaId])
                .then(async result => {
                    resolve(await this.getById(pizzaId));
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