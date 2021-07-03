import * as express from "express";
import PizzaController from "./controller";
import PizzaService from "./service";

export default class PizzaRouter {
    public static setupRoutes(app: express.Application) {
        const pizzaService: PizzaService = new PizzaService();
        const pizzaController: PizzaController = new PizzaController(pizzaService);

        app.get("/pizza",       pizzaController.getAll.bind(pizzaController));
        app.get("/pizza/:id",   pizzaController.getAll.bind(pizzaController));
    }
}