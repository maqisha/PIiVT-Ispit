import { Request, Response, NextFunction } from "express";
import BaseController from "../../common/BaseController";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddOrderValidator } from "./dto/IOrder";
import OrderModel, { CartModel } from "./model";

class OrderController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: OrderModel[] | null | IErrorResponse = await this.services.orderService.getAll({ loadUser: true, loadPizzaOrders: true });

        if (data === null) return res.sendStatus(404);
        if (Array.isArray(data)) return res.send(data);
        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        
        if (!IAddOrderValidator(data)) {
            res.status(400).send(IAddOrderValidator.errors);
            console.log(data)
            return;
        }

        const result: OrderModel | IErrorResponse = await this.services.orderService.add(req.authorized.id, data as CartModel);

        res.send(result);
    }
}

export default OrderController;