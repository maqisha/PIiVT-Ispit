import * as mysql2 from "mysql2/promise";
import AdaptModelOptions from "../../common/IAdaptModelOptions.interface";
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

    public async getAll(): Promise<PizzaModel[]> {
        const list: PizzaModel[] = [];

        const sql: string = "SELECT * FROM pizza;";
        const [rows, columns] = await this.conn.execute(sql);

        if (Array.isArray(rows)) {
            for (const row of rows) {
                list.push(await this.adaptModel(row));
            };
        }

        return list;
    }

    public async getById(pizzaId: number): Promise<PizzaModel | null> {
        const sql: string = "SELECT * FROM pizza WHERE pizza_id = ?;";
        const [rows, columns] = await this.conn.execute(sql, [pizzaId]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        return await this.adaptModel(rows[0])

    }
}