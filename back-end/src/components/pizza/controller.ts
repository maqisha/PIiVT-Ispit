import { NextFunction, Request, Response } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddCategoryValidator, IAddPizza } from "./dto/AddPizza";
import { IEditCategoryValidator, IEditPizza } from "./dto/EditPizza";
import PizzaModel from "./model";
import PizzaService from "./service";

export default class PizzaController {
    private pizzaService: PizzaService;

    constructor(pizzaService: PizzaService) {
        this.pizzaService = pizzaService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const data: PizzaModel[] | null | IErrorResponse = await this.pizzaService.getAll();

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

    async getById(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +req.params.id;

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }
        const data: PizzaModel | null | IErrorResponse = await this.pizzaService.getById(pizzaId);

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

    async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddCategoryValidator(data)) {
            res.status(400).send(IAddCategoryValidator.errors);
            return;
        }

        const result: PizzaModel | IErrorResponse = await this.pizzaService.add(data as IAddPizza);

        res.send(result);
    }

    async edit(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +(req.params.id);

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        const data = req.body;

        if (!IEditCategoryValidator(data)) {
            res.status(400).send(IEditCategoryValidator.errors);
            return;
        }

        const result: PizzaModel | IErrorResponse = await this.pizzaService.edit(data as IEditPizza, pizzaId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }
    
    async delete(req: Request, res: Response, next: NextFunction) {
        const pizzaId: number = +(req.params.id);

        if (pizzaId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        res.send(await this.pizzaService.delete(pizzaId));
    }
}