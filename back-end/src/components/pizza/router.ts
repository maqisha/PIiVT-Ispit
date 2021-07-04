import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import PizzaController from "./controller";
import PizzaService from "./service";

export default class PizzaRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const pizzaService: PizzaService = new PizzaService(resources.conn);
        const pizzaController: PizzaController = new PizzaController(pizzaService);

        app.get("/pizza", pizzaController.getAll.bind(pizzaController));
        app.get("/pizza/:id", pizzaController.getById.bind(pizzaController));
        app.post("/pizza", pizzaController.add.bind(pizzaController));
        app.put("/pizza/:id", pizzaController.edit.bind(pizzaController));
    }
}