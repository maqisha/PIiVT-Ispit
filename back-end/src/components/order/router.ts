import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import OrderController from "./controller";

export default class OrderRouter implements IRouter {
    public setupRoutes(app: express.Application, resources: IApplicationResources) {
        const orderController: OrderController = new OrderController(resources);

        app.get("/order", orderController.getAll.bind(orderController));
        app.post("/order", AuthMiddleware.getVerifier('user','administrator'), orderController.add.bind(orderController));
    }
}