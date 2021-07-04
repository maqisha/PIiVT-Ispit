import * as mysql2 from "mysql2/promise";
import AdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import PizzaModel from "./model";

export default class PizzaService {
    conn: mysql2.Connection;

    constructor(conn: mysql2.Connection) {
        this.conn = conn;
    }

    protected async adaptModel(row: any, options: Partial<AdaptModelOptions> = { loadIngredients: true }): Promise<PizzaModel> {
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
        return new Promise<PizzaModel[] | null | IErrorResponse>(async resolve => {
            const sql: string = "SELECT * FROM pizza;";
            this.conn.execute(sql)
                .then(async result => {
                    const [rows, columns] = result;
                    const list: PizzaModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            list.push(await this.adaptModel(row));
                        };
                    }

                    resolve(list);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    });
                });
        });
    }

    public async getById(pizzaId: number): Promise<PizzaModel | null | IErrorResponse> {
        return new Promise<PizzaModel | null | IErrorResponse>(async resolve => {
            const sql: string = "SELECT * FROM pizza WHERE pizza_id = ?;";
            this.conn.execute(sql, [pizzaId])
                .then(async result => {
                    const [rows, columns] = result;

                    if (!Array.isArray(rows) || rows.length === 0) {
                        resolve(null);
                        return;
                    }

                    resolve(await this.adaptModel(rows[0]));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    });
                })

        });
    }
}