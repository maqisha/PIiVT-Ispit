import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import UserController from "./controller";

export default class UserRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const userController: UserController = new UserController(resources);

        app.get("/user", userController.getAll.bind(userController));
        app.get("/user/:id", userController.getById.bind(userController));
        app.post("/user", userController.add.bind(userController));
        app.put("/user/:id", userController.edit.bind(userController));
        app.delete("/user/:id", userController.delete.bind(userController));
    }
}