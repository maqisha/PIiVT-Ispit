import PizzaModel from "../../../back-end/src/components/pizza/model";
import api, { apiAsForm } from "../api/api";


export interface IEditData {
    pizzaId: number,
    name: string,
    price: number,
    ingredientIds: number[],
    file: File | undefined,
}
export default class PizzaService {
    public static getAll(): Promise<PizzaModel[]> {
        return new Promise<PizzaModel[]>(resolve => {
            api(
                "get",
                "/pizza"
            )
                .then(result => {
                    if (result?.status !== "ok") {
                        //emit event
                        return resolve([]);
                    }

                    resolve(result.data as PizzaModel[]);
                })
        })
    }

    public static edit(data: IEditData): Promise<PizzaModel | null> {
        return new Promise<PizzaModel | null>(resolve => {
            const formData = new FormData();
            formData.append("data", JSON.stringify({
                name: data.name,
                price: data.price,
                ingredientIds: data.ingredientIds
            }))
            if (data.file) formData.append("image", data.file);


            apiAsForm('put', `/pizza/${data.pizzaId}`, formData).then(res => console.log(res)).catch(e => console.log(e))
        })
    }
}