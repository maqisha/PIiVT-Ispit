import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import UserController from "./controller";

export default class UserRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const userController: UserController = new UserController(resources);

        app.get("/user", AuthMiddleware.getVerifier('administrator'), userController.getAll.bind(userController));
        app.get("/user/:id", AuthMiddleware.getVerifier('administrator', 'user'), userController.getById.bind(userController));
        app.post("/user", AuthMiddleware.getVerifier('administrator'), userController.add.bind(userController));
        app.put("/user/:id", AuthMiddleware.getVerifier('administrator', 'user'), userController.edit.bind(userController));
        app.delete("/user/:id", AuthMiddleware.getVerifier('administrator'), userController.delete.bind(userController));
        app.post("/auth/register", AuthMiddleware.getVerifier('administrator', 'user'), userController.register.bind(userController))
    }
}