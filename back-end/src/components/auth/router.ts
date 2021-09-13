import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import AuthController from "./controller";

export default class AuthRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources);

        app.get("/auth/user", AuthMiddleware.getVerifier("user"), authController.checkUser.bind(authController))
        app.get("/auth/administrator", AuthMiddleware.getVerifier("administrator"), authController.checkAdministrator.bind(authController))
        app.post("/auth/login", authController.userLogin.bind(authController));
        app.post("/auth/refresh", authController.refreshToken.bind(authController));
    }
}