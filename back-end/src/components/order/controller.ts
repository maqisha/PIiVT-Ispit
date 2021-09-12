import { Request, Response, NextFunction } from "express";
import BaseController from "../../common/BaseController";
import IErrorResponse from "../../common/IErrorResponse.interface";
import OrderModel from "./model";

class OrderController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: OrderModel[] | null | IErrorResponse = await this.services.orderService.getAll({ loadUser: true, loadPizzaOrders: true });

        if (data === null) return res.sendStatus(404);
        if (Array.isArray(data)) return res.send(data);
        res.status(500).send(data);
    }
}

export default OrderController;