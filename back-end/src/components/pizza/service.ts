import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddPizza } from "./dto/AddPizza";
import { IEditPizza } from "./dto/EditPizza";
import PizzaModel from "./model";
import IngredientModel from "../ingredient/model";

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

        if (options.loadIngredients) {
            pizza.ingredients = await this.services.ingredientService.getAllByPizzaId(pizza.pizzaId) as IngredientModel[];
        }

        return pizza;
    }

    public async getAll(options: Partial<PizzaModelAdapterOptions> = {}): Promise<PizzaModel[] | null | IErrorResponse> {
        return await this.getAllFromTable<PizzaModelAdapterOptions>("pizza", options);
    }

    public async getById(pizzaId: number, options: Partial<PizzaModelAdapterOptions> = {}): Promise<PizzaModel | null | IErrorResponse> {
        return await this.getByIdFromTable<PizzaModelAdapterOptions>("pizza", pizzaId, options);
    }

    public async add(data: IAddPizza): Promise<PizzaModel | IErrorResponse> {
        return new Promise<PizzaModel | IErrorResponse>(async resolve => {
            this.db.beginTransaction()
                .then(() => {
                    const sql = "INSERT pizza SET name = ?, image_path = ?, price = ?;";
                    this.db.execute(sql, [data.name, data.imagePath, data.price])
                        .then(async (result: any) => {
                            const newPizzaId: number = +(result[0]?.insertId);
                            const promises = [];

                            for (const ingredientId of data.ingredientIds) {
                                promises.push(
                                    this.db.execute(
                                        'INSERT pizza_ingredient SET pizza_id = ?, ingredient_id = ?',
                                        [newPizzaId, ingredientId]
                                    )
                                )
                            }

                            Promise.all(promises)
                                .then(async () => {
                                    await this.db.commit();
                                    resolve(await this.getById(newPizzaId));
                                })
                        })
                        .catch(async error => {
                            await this.db.rollback();

                            resolve({
                                errorCode: error?.errno,
                                errorMessage: error?.sqlMessage,
                            })
                        });

                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

    public async edit(newPizza: IEditPizza, pizzaId: number): Promise<PizzaModel | null | IErrorResponse> {
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

            this.db.execute(sql, [newPizza.name, newPizza.imagePath, newPizza.price, pizzaId])
                .then(async result => {
                    resolve(await this.getById(pizzaId, { loadIngredients: true }));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    })
                });
        })
    }

    public async delete(pizzaId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM pizza WHERE pizza_id = ?;";
            this.db.execute(sql, [pizzaId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "1 record deleted!"
                        })
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "Record could not be deleted!"
                        })
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    })
                })
        })
    }
}