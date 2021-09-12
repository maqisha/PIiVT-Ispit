import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import IngredientController from "./controller";

export default class IngredientRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const ingredientController: IngredientController = new IngredientController(resources);

        app.get("/ingredient", AuthMiddleware.getVerifier('administrator', 'user'), ingredientController.getAll.bind(ingredientController));
        app.get("/ingredient/:id", AuthMiddleware.getVerifier('administrator', 'user'), ingredientController.getById.bind(ingredientController));
        app.post("/ingredient", AuthMiddleware.getVerifier('administrator'), ingredientController.add.bind(ingredientController));
        app.put("/ingredient/:id", AuthMiddleware.getVerifier('administrator'), ingredientController.edit.bind(ingredientController));
        app.delete("/ingredient/:id", AuthMiddleware.getVerifier('administrator'), ingredientController.delete.bind(ingredientController));
    }
}