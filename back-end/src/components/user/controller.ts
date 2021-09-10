import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import UserModel from "./model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddUser, IAddUserValidator } from "./dto/IAddUser";
import { IEditUser, IEditUserValidator } from "./dto/IEditUser";
import * as nodemailer from "nodemailer";
import CFG from "../../config/dev";

export default class UserController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const data: UserModel[] | null | IErrorResponse = await this.services.userService.getAll();

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
        const userId: number = +(req.params.id);

        if (userId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        const data: UserModel | null | IErrorResponse = await this.services.userService.getById(userId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof UserModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddUserValidator(data)) {
            res.status(400).send(IAddUserValidator.errors);
            return;
        }

        const result: UserModel | IErrorResponse = await this.services.userService.add(data as IAddUser);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const userId = +(req.params.id);

        if (userId <= 0) {
            res.status(400).send("Invalid ID number.");
            return;
        }

        if (!IEditUserValidator(data)) {
            res.status(400).send(IEditUserValidator.errors);
            return;
        }

        const result: UserModel | IErrorResponse = await this.services.userService.edit(userId, data as IEditUser);

        if (result === null) return res.sendStatus(404);

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const userId: number = +(req.params.id);
        if (userId <= 0) return res.status(400).send("Invalid ID number.");
        res.send(await this.services.userService.delete(userId));
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddUserValidator(data)) {
            res.status(400).send(IAddUserValidator.errors);
            return;
        }

        const result: UserModel | IErrorResponse = await this.services.userService.add(data as IAddUser);

        if (!(result instanceof UserModel)) {
            if (result.errorMessage.includes("uq_user_email")) {
                return res.status(400).send("This email is already taken!");
            }

            return res.status(400).send(result);
        }

        if ((await this.sendRegistrationEmail(result)).errorCode !== 0) {
            // error
        }

        res.send(result);
    }

    private async sendRegistrationEmail(data: UserModel): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const transport = nodemailer.createTransport(
                {
                    host: CFG.mail.hostname,
                    port: CFG.mail.port,
                    secure: CFG.mail.secure,
                    auth: {
                        user: CFG.mail.username,
                        pass: CFG.mail.password,
                    },
                    debug: CFG.mail.debug,
                },
                {
                    from: CFG.mail.fromMail,
                }
            );

            transport.sendMail({
                to: data.email,
                subject: "Account registration!",
                html: `
                   <h3> Dear ${data.name}. </h3>
                   <p> Your account was successfuly created</p>
                `
            })
                .then(() => {
                    transport.close();

                    resolve({
                        errorCode: 0,
                        errorMessage: "",
                    })
                })
                .catch(error => {
                    transport.close();
                    
                    resolve({
                        errorCode: -1,
                        errorMessage: error.message,
                    })
                })
        })
    }
}