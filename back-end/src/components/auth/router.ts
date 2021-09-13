import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthController from "./controller";

export default class AuthRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources);

        app.post("/auth/login", authController.userLogin.bind(authController));
        app.post("/auth/refresh", authController.refreshToken.bind(authController));
    }
}