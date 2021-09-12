import PizzaModel from "../../../back-end/src/components/pizza/model";
import api from "../api/api";

export default class PizzaService {
    public static getAll(): Promise<PizzaModel[]> {
        return new Promise<PizzaModel[]>(resolve => {
            api(
                "get",
                "/pizza",
            )
                .then(result => {
                    if(result?.status !== "ok") {
                        //emit event
                        return resolve([]);
                    }

                    resolve(result.data as PizzaModel[]);
                })
        })
    }
}