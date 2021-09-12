import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import PizzaController from "./controller";

export default class PizzaRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const pizzaController: PizzaController = new PizzaController(resources);

        app.get("/pizza", AuthMiddleware.getVerifier('administrator', 'user'), pizzaController.getAll.bind(pizzaController));
        app.get("/pizza/:id", AuthMiddleware.getVerifier('administrator', 'user'), pizzaController.getById.bind(pizzaController));
        app.post("/pizza", AuthMiddleware.getVerifier('administrator'), pizzaController.add.bind(pizzaController));
        app.put("/pizza/:id", AuthMiddleware.getVerifier('administrator'), pizzaController.edit.bind(pizzaController));
        app.delete("/pizza/:id", AuthMiddleware.getVerifier('administrator'), pizzaController.delete.bind(pizzaController));
    }
}