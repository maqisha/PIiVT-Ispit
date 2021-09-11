import IModel from "./IModel.interface";
import IAdaptModelOptions from "./IAdaptModelOptions.interface";
import * as mysql2 from 'mysql2/promise';
import IErrorResponse from "./IErrorResponse.interface";
import IApplicationResources from "./IApplicationResources.interface";
import IServices from "./IServices.interface";

export default abstract class BaseService<T extends IModel> {
    private resources: IApplicationResources;

    constructor(resources: IApplicationResources) {
        this.resources = resources;
    }

    protected get db(): mysql2.Connection {
        return this.resources.conn;
    }

    protected get services(): IServices {
        return this.resources.services;
    }

    protected abstract adaptModel(
        data: any,
        options: Partial<IAdaptModelOptions>
    ): Promise<T>

    protected async getAllFromTable<AdapterOptions extends IAdaptModelOptions>(tableName: string, options: Partial<AdapterOptions> = {}): Promise<T[] | null | IErrorResponse> {
        return new Promise<T[] | null | IErrorResponse>(async resolve => {
            const sql: string = `SELECT * FROM ${tableName};`;
            this.resources.conn.execute(sql)
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

    protected async getByIdFromTable<AdapterOptions extends IAdaptModelOptions>(tableName: string, id: number, options: Partial<AdapterOptions> = {}): Promise<T | null | IErrorResponse> {
        return new Promise<T | null | IErrorResponse>(async resolve => {
            const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
            this.resources.conn.execute(sql, [id])
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

    protected async getAllByFieldNameFromTable<AdapterOptions extends IAdaptModelOptions>(
        tableName: string,
        fieldName: string,
        fieldValue: any,
        options: Partial<AdapterOptions> = {}
    ): Promise<T[] | IErrorResponse> {
        return new Promise<T[] | IErrorResponse>(async (resolve) => {
            let sql = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?;`;

            if (fieldValue === null) {
                sql = `SELECT * FROM ${tableName} WHERE ${fieldName} IS NULL;`;
            }

            this.db.execute(sql, [fieldValue])
                .then(async result => {
                    const rows = result[0];
                    const lista: T[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(
                                await this.adaptModel(row, options)
                            )
                        }
                    }

                    resolve(lista);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
}