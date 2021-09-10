import { NextFunction, Request, Response } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseController from "../../common/BaseController";
import { IAddPizzaValidator, IAddPizza } from "./dto/AddPizza";
import { IEditPizzaValidator, IEditPizza } from "./dto/EditPizza";
import PizzaModel from "./model";
import CFG from "../../config/dev";
import { v4 as uuid } from 'uuid';
import { UploadedFile } from "express-fileupload";
import sizeOf from "image-size";

export default class PizzaController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: PizzaModel[] | null | IErrorResponse = await this.services.pizzaService.getAll({ loadIngredients: true });

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
        const data: PizzaModel | null | IErrorResponse = await this.services.pizzaService.getById(pizzaId, { loadIngredients: true });

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

    private isValidPhoto(file: UploadedFile): { isOk: boolean, message?: string } {
        const size = sizeOf(file.tempFilePath);
        const limits = CFG.fileupload.photos.limits

        if(size.width < limits.minWidth) {
            return {
                isOk: false,
                message: `The image must have a width of at least ${limits.minWidth}px`
            }
        }

        if(size.width > limits.maxWidth) {
            return {
                isOk: false,
                message: `The image must have a width less than ${limits.maxWidth}px`
            }
        }

        if(size.height < limits.minHeight) {
            return {
                isOk: false,
                message: `The image must have a height of at least ${limits.minHeight}px`
            }
        }

        if(size.height > limits.maxHeight) {
            return {
                isOk: false,
                message: `The image must have a height less than ${limits.maxHeight}px`
            }
        }

        return {
            isOk: true,
        }
    }

    private async uploadFile(req: Request, res: Response): Promise<string> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload a photo!");
            return null;
        }

        const file = req.files[Object.keys(req.files)[0]] as any;

        const photoValidation = this.isValidPhoto(file);
        if(!photoValidation.isOk) {
            res.status(400).send(photoValidation.message);
            return null;
        }

        const date = new Date();
        const imagePath =
            CFG.fileupload.uploadDir +
            date.getFullYear() + "/" +
            ((date.getMonth() + 1) + "").padStart(2, "0") + "/" +
            uuid() + "-" + file?.name;

        await file.mv(imagePath);
        return imagePath;
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const imagePath = await this.uploadFile(req, res);
        if (!imagePath) {
            return;
        }

        const data = JSON.parse(req.body?.data);
        data.imagePath = imagePath;

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