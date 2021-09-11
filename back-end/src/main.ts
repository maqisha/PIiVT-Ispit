import * as express from "express";
import * as cors from "cors";
import CFG from "./config/dev";
import PizzaRouter from "./components/pizza/router";
import * as mysql2 from "mysql2/promise";
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from "./router";
import IngredientRouter from "./components/ingredient/router";
import PizzaService from "./components/pizza/service";
import IngredientService from "./components/ingredient/service";
import * as fileUpload from "express-fileupload";
import UserService from "./components/user/service";
import UserRouter from "./components/user/router";
import AuthRouter from "./components/auth/router";

async function main() {
    const app: express.Application = express();

    app.use(cors());
    app.use(express.json());
    app.use(fileUpload({
        limits: {
            fileSize: CFG.fileupload.maxSize,
            files: CFG.fileupload.maxFiles
        },
        useTempFiles: true,
        tempFileDir: CFG.fileupload.tempDir,
        uploadTimeout: CFG.fileupload.timeout,
        safeFileNames: true,
        preserveExtension: true,
        createParentPath: true,
        abortOnLimit: true,
    }));

    const resources: IApplicationResources = {
        conn: await mysql2.createConnection({
            host: CFG.database.host,
            port: CFG.database.port,
            user: CFG.database.user,
            password: CFG.database.password,
            database: CFG.database.database,
            charset: CFG.database.charset,
            timezone: CFG.database.timezone,
            supportBigNumbers: true,
        }),
    }

    resources.conn.connect();

    resources.services = {
        pizzaService: new PizzaService(resources),
        ingredientService: new IngredientService(resources),
        userService: new UserService(resources),
    }

    app.use(
        CFG.server.static.route,
        express.static(CFG.server.static.path, {
            index: CFG.server.static.index,
            cacheControl: CFG.server.static.cacheControl,
            maxAge: CFG.server.static.maxAge,
            etag: CFG.server.static.etag,
            dotfiles: CFG.server.static.dotfiles,
        }));

    Router.setupRoutes(app, resources, [
        new PizzaRouter(),
        new IngredientRouter(),
        new UserRouter(),
        new AuthRouter(),
    ]);

    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });

    app.listen(CFG.server.port);
}

main();
