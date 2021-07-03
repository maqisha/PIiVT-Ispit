import PizzaModel from "./model";

export default class PizzaService {
    public async getAll(): Promise<PizzaModel[]> {
        const list: PizzaModel[] = [];

        list.push({
            pizzaId: 1,
            name: "Margarita",
            price: 400,
            isActive: true,
            imagePath: "www.test.com",
            ingredients: [],
        });
        return list;
    }

    public async getById(pizzaId: number): Promise<PizzaModel | null> {
        return {
            pizzaId: 1,
            name: "Margarita",
            price: 400,
            isActive: true,
            imagePath: "www.test.com",
            ingredients: [],
        };
    }
}