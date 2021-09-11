import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import PizzaController from "./controller";

export default class PizzaRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const pizzaController: PizzaController = new PizzaController(resources);

        app.get("/pizza", AuthMiddleware.getVerifier('administrator', 'user'), pizzaController.getAll.bind(pizzaController));
        app.get("/pizza/:id", pizzaController.getById.bind(pizzaController));
        app.post("/pizza", pizzaController.add.bind(pizzaController));
        app.put("/pizza/:id", pizzaController.edit.bind(pizzaController));
        app.delete("/pizza/:id", pizzaController.delete.bind(pizzaController));
    }
}