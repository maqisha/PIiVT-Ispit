import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import IngredientController from "./controller";
import IngredientService from "./service";

export default class IngredientRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const ingredientService: IngredientService = new IngredientService(resources.conn);
        const ingredientController: IngredientController = new IngredientController(ingredientService);

        app.get("/ingredient", ingredientController.getAll.bind(ingredientController));
        app.get("/ingredient/:id", ingredientController.getById.bind(ingredientController));
        app.post("/ingredient", ingredientController.add.bind(ingredientController));
        app.put("/ingredient/:id", ingredientController.edit.bind(ingredientController));
        app.delete("/ingredient/:id", ingredientController.delete.bind(ingredientController));
    }
}