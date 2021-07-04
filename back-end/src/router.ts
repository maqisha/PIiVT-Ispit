import * as express from "express";
import IApplicationResources from "./common/IApplicationResources.interface";
import IRouter from "./common/IRouter.interface";

export default class Router {
    static setupRoutes(app: express.Application, resources: IApplicationResources, routers: IRouter[]) {
        routers.forEach(router => {
            router.setupRoutes(app, resources);
        });
    }
}