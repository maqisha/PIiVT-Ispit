import { NextFunction, Request, Response } from "express";
import PizzaModel from "./model";
import PizzaService from "./service";

export default class PizzaController {
    private pizzaService: PizzaService;

    constructor(pizzaService: PizzaService) {
        this.pizzaService = pizzaService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const pizzas: PizzaModel[] | null = await this.pizzaService.getAll();

        res.send(pizzas);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +req.params.id;

        if (pizzaId <= 0) {
            res.sendStatus(400);
            return;
        }
        const pizza: PizzaModel | null = await this.pizzaService.getById(pizzaId);

        if (pizza === null) {
            res.sendStatus(404);
            return;
        }

        res.send(pizza);
    }
}