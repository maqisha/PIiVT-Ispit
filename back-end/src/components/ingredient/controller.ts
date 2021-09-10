import { Request, Response, NextFunction } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseController from "../../common/BaseController";
import { IAddIngredient, IAddIngredientValidator } from "./dto/AddIngredient";
import { IEditIngredient, IEditIngredientValidator } from "./dto/EditIngredient";
import IngredientModel from "./model";

export default class IngredientController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: IngredientModel[] | null | IErrorResponse = await this.services.ingredientService.getAll();

        if (data === null) return res.sendStatus(404);
        if (Array.isArray(data)) return res.send(data);

        res.status(500).send(data);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const ingredientId: number = +(req.params.id);

        if (ingredientId <= 0) return res.status(400).send("Invalid ID number.");

        const data: IngredientModel | null | IErrorResponse = await this.services.ingredientService.getById(ingredientId, {});

        if (data === null) return res.sendStatus(404);
        if (data instanceof IngredientModel) return res.send(data);
        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddIngredientValidator(data)) return res.status(400).send(IAddIngredientValidator.errors);

        const result: IngredientModel | IErrorResponse = await this.services.ingredientService.add(data as IAddIngredient);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const ingredientId = +(req.params.id);

        if (ingredientId <= 0) return res.status(400).send("Invalid ID number.");
        if (!IEditIngredientValidator(data)) return res.status(400).send(IEditIngredientValidator.errors);

        const result: IngredientModel | null | IErrorResponse = await this.services.ingredientService.edit(data as IEditIngredient, ingredientId);

        if (result === null) return res.sendStatus(404);
        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const ingredientId: number = +(req.params.id);

        if (ingredientId <= 0) return res.status(400).send("Invalid ID number.");
        res.send(await this.services.ingredientService.delete(ingredientId));
    }
}