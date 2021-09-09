import { NextFunction, Request, Response } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseController from "../../common/BaseController";
import { IAddPizzaValidator, IAddPizza } from "./dto/AddPizza";
import { IEditPizzaValidator, IEditPizza } from "./dto/EditPizza";
import PizzaModel from "./model";
import PizzaService from "./service";

export default class PizzaController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: PizzaModel[] | null | IErrorResponse = await this.services.pizzaService.getAll();

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (Array.isArray(data)) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +req.params.id;

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }
        const data: PizzaModel | null | IErrorResponse = await this.services.pizzaService.getById(pizzaId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof PizzaModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddPizzaValidator(data)) {
            res.status(400).send(IAddPizzaValidator.errors);
            return;
        }

        const result: PizzaModel | IErrorResponse = await this.services.pizzaService.add(data as IAddPizza);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +(req.params.id);

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        const data = req.body;

        if (!IEditPizzaValidator(data)) {
            res.status(400).send(IEditPizzaValidator.errors);
            return;
        }

        const result: PizzaModel | null | IErrorResponse = await this.services.pizzaService.edit(data as IEditPizza, pizzaId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +(req.params.id);

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        res.send(await this.services.pizzaService.delete(pizzaId));
    }
}