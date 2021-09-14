import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import { IUserLogin, IUserLoginValidator } from "./dto/IUserLogin";
import * as bcrypt from "bcrypt";
import UserModel from "../user/model";
import ITokenData from "./dto/ITokenData.inferface";
import * as jwt from "jsonwebtoken";
import CFG from "../../config/dev";
import { IRefreshToken, IRefreshTokenValidator } from "./dto/IRefreshToken";

export default class AuthController extends BaseController {
    public async checkUser(req: Request, res: Response, next: NextFunction) {
        res.send("OK");
    }

    public async checkAdministrator(req: Request, res: Response, next: NextFunction) {
        res.send("OK");
    }

    public async userLogin(req: Request, res: Response, next: NextFunction) {
        if (!IUserLoginValidator(req.body)) {
            return res.status(400).send(IUserLoginValidator.errors);
        }

        const data = req.body as IUserLogin;

        const user = await this.services.userService.getByEmail(data.email) as UserModel;
        if (user === null) return res.status(404).send("User not found.")

        if (!bcrypt.compareSync(data.password, user.passwordHash)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(403).send("Invalid user password.");
        }

        const authTokenData: ITokenData = {
            id: user.userId,
            identity: user.email,
            role: user.isAdmin ? "administrator" : "user"
        }

        const refreshTokenData: ITokenData = {
            id: user.userId,
            identity: user.email,
            role: user.isAdmin ? "administrator" : "user"
        }

        const authToken = jwt.sign(
            authTokenData,
            user.isAdmin ? CFG.auth.administrator.auth.private : CFG.auth.user.auth.private,
            {
                algorithm: user.isAdmin ? CFG.auth.administrator.algorithm : CFG.auth.user.algorithm,
                issuer: user.isAdmin ? CFG.auth.administrator.issuer : CFG.auth.user.issuer,
                expiresIn: user.isAdmin ? CFG.auth.administrator.auth.duration : CFG.auth.user.auth.duration,
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenData,
            user.isAdmin ? CFG.auth.administrator.refresh.private : CFG.auth.user.refresh.private,
            {
                algorithm: user.isAdmin ? CFG.auth.administrator.algorithm : CFG.auth.user.algorithm,
                issuer: user.isAdmin ? CFG.auth.administrator.issuer : CFG.auth.user.issuer,
                expiresIn: user.isAdmin ? CFG.auth.administrator.refresh.duration : CFG.auth.user.refresh.duration,
            }
        );

        res.send({
            authToken,
            refreshToken,
            role: user.isAdmin ? "administrator" : "user"
        })
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        if (!IRefreshTokenValidator(req.body)) {
            return res.status(400).send(IRefreshTokenValidator.errors);
        }

        const token: IRefreshToken = req.body as IRefreshToken;

        try {
            const tokenData = jwt.verify(token.refreshToken, CFG.auth[token.role].auth.public) as ITokenData;

            const newTokenData: ITokenData = {
                id: tokenData.id,
                identity: tokenData.identity,
                role: tokenData.role,
            }

            const authToken = jwt.sign(
                newTokenData,
                token.role === 'administrator' ? CFG.auth.administrator.auth.private : CFG.auth.user.auth.private,
                {
                    algorithm: token.role === 'administrator' ? CFG.auth.administrator.algorithm : CFG.auth.user.algorithm,
                    issuer: token.role === 'administrator' ? CFG.auth.administrator.issuer : CFG.auth.user.issuer,
                    expiresIn: token.role === 'administrator' ? CFG.auth.administrator.auth.duration : CFG.auth.user.auth.duration,
                }
            );

            res.send({
                authToken,
                refreshToken: null,
                role: token.role,
            })
        } catch (error) {
            return res.status(400).send("Invalid refresh token " + error?.message);
        }
    }
}