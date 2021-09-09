import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IAdaptModelOptionsInterface from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddIngredient } from "./dto/AddIngredient";
import IngredientModel from "./model";

class IngredientModelAdapterOptions implements IAdaptModelOptions {

}

class IngredientService extends BaseService<IngredientModel> {
    protected async adaptModel(data: any, options: Partial<IngredientModelAdapterOptions>): Promise<IngredientModel> {
        const ingredient: IngredientModel = new IngredientModel();

        ingredient.ingredientId = +(data?.ingredient_id);
        ingredient.name = data?.name;
        ingredient.price = +(data?.price);

        return ingredient;
    }

    public async getById(ingredientId: number, options: Partial<IngredientModelAdapterOptions> = {}): Promise<IngredientModel | null | IErrorResponse> {
        return await this.getByIdFromTable("ingredient", ingredientId, options);
    }

    public async getAll(options: Partial<IngredientModelAdapterOptions> = {}): Promise<IngredientModel[] | null | IErrorResponse> {
        return await this.getAllFromTable("ingredient", options);
    }

    public async add(data: IAddIngredient): Promise<IngredientModel | IErrorResponse> {
        return new Promise<IngredientModel | IErrorResponse>(resolve => {
            const sql = "INSERT ingredient SET name = ?, price = ?;";

            this.db.execute(sql, [data.name, data.price])
                .then(async result => {
                    const insertInfo: any = result[0];
                    const newIngredientId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newIngredientId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })
        })
    }

    public async edit(newIngredient: IAddIngredient, ingredientId: number): Promise<IngredientModel | null | IErrorResponse> {
        return new Promise<IngredientModel | null | IErrorResponse>(async resolve => {
            const oldIngredient = await this.getById(ingredientId);

            if (oldIngredient === null) {
                resolve(null);
                return null;
            }

            if (!(oldIngredient instanceof IngredientModel)) {
                return oldIngredient;
            }

            const sql = "UPDATE ingredient SET name = ?, price = ? WHERE ingredient_id = ?;";
            this.db.execute(sql, [newIngredient.name, newIngredient.price, ingredientId])
                .then(async result => {
                    resolve(await this.getById(ingredientId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    })
                });
        })
    }

    public async delete(ingredientId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM ingredient WHERE ingredient_id = ?;";
            this.db.execute(sql, [ingredientId])
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

export default IngredientService