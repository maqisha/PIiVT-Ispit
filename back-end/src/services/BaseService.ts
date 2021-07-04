import IModel from "../common/IModel.interface";
import IAdaptModelOptions from "../common/IAdaptModelOptions.interface";
import * as mysql2 from 'mysql2/promise';
import IErrorResponse from "../common/IErrorResponse.interface";

export default abstract class BaseService<T extends IModel> {
    private conn: mysql2.Connection;

    constructor(conn: mysql2.Connection) {
        this.conn = conn;
    }

    protected get db(): mysql2.Connection {
        return this.conn;
    }

    protected abstract adaptModel(
        data: any,
        options: Partial<IAdaptModelOptions>
    ): Promise<T>

    protected async getAllFromTable(tableName: string, options: Partial<IAdaptModelOptions> = {}): Promise<T[] | null | IErrorResponse> {
        return new Promise<T[] | null | IErrorResponse>(async resolve => {
            const sql: string = `SELECT * FROM ${tableName};`;
            this.conn.execute(sql)
                .then(async result => {
                    const [rows, columns] = result;
                    const list: T[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            list.push(await this.adaptModel(row, options));
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

    protected async getByIdFromTable(tableName: string, id: number, options: Partial<IAdaptModelOptions> = {}): Promise<T | null | IErrorResponse> {
        return new Promise<T | null | IErrorResponse>(async resolve => {
            const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
            this.conn.execute(sql, [id])
                .then(async result => {
                    const [rows, columns] = result;

                    if (!Array.isArray(rows) || rows.length === 0) {
                        resolve(null);
                        return;
                    }

                    resolve(await this.adaptModel(rows[0], options));
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