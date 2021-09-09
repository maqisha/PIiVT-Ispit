import { Request, Response, NextFunction } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseController from "../../common/BaseController";
import { IAddIngredient, IAddIngredientValidator } from "./dto/AddIngredient";
import { IEditIngredient, IEditIngredientValidator } from "./dto/EditIngredient";
import IngredientModel from "./model";
import IngredientService from "./service";

export default class IngredientController extends BaseController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        const data: IngredientModel[] | null | IErrorResponse = await this.services.ingredientService.getAll();

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
        const ingredientId: number = +(req.params.id);

        if (ingredientId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        const data: IngredientModel | null | IErrorResponse = await this.services.ingredientService.getById(ingredientId, {});

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof IngredientModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddIngredientValidator(data)) {
            res.status(400).send(IAddIngredientValidator.errors);
            return;
        }

        const result: IngredientModel | IErrorResponse = await this.services.ingredientService.add(data as IAddIngredient);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const ingredientId = +(req.params.id);

        if (ingredientId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        if (!IEditIngredientValidator(data)) {
            res.status(400).send(IEditIngredientValidator.errors);
            return;
        }

        const result: IngredientModel | null | IErrorResponse = await this.services.ingredientService.edit(data as IEditIngredient, ingredientId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }
        
        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const ingredientId: number = +(req.params.id);

        if (ingredientId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        res.send(await this.services.ingredientService.delete(ingredientId));
    }
}