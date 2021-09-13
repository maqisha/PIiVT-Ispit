import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import ITokenData from "../components/auth/dto/ITokenData.inferface";
import CFG from "../config/dev";

type UserRole = "user" | "administrator";

export default class AuthMiddleware {
    private static veryfyAuthToken(req: Request, res: Response, next: NextFunction, allowedRoles: UserRole[]) {
        // return next();
        if (typeof req.headers.authorization !== "string") {
            return res.status(401).send("You are not authorized for this action");
        }

        const [tokenType, tokenString] = req.headers.authorization.trim().split(" ");

        if (tokenType !== "Bearer") {
            return res.status(401).send("Invalid auth token type!");
        }

        if (typeof tokenString !== "string" || tokenString.length === 0) {
            return res.status(401).send("Invalid auth token data!");
        }


        let result;
        try {
            if (allowedRoles.includes("administrator")) {
                result = jwt.verify(tokenString, CFG.auth.administrator.auth.public);
                if (typeof result !== "object")
                    result = jwt.verify(tokenString, CFG.auth.user.auth.public);
            } else
                result = jwt.verify(tokenString, CFG.auth.user.auth.public);
        } catch (e) {
            return res.status(401).send("Token validation error " + e?.message);
        }

        
        if (typeof result !== "object") {
            return res.status(401).send("Invalid auth token data!");
        }

        const data: ITokenData = result as ITokenData;

        if (!allowedRoles.includes(data.role)) {
            return res.status(403).send("Access denied!");
        }

        req.authorized = data;
        next();
    }

    public static getVerifier(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.veryfyAuthToken(req, res, next, allowedRoles);
        }
    }
}