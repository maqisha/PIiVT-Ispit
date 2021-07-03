import { NextFunction, Request, Response } from "express";
import PizzaModel from "./model";
import PizzaService from "./service";

export default class PizzaController {
    private pizzaService: PizzaService;

    constructor(pizzaService: PizzaService) {
        this.pizzaService = pizzaService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const pizzas = await this.pizzaService.getAll();
        res.send(pizzas);
    }
}