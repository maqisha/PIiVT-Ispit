import * as express from "express";
import * as cors from "cors";
import CFG from "./config/dev";
import PizzaRouter from "./components/pizza/router";
import * as mysql2 from "mysql2/promise";
import IApplicationResources from "./common/IApplicationResources.interface";

async function main() {
    const app: express.Application = express();

    app.use(cors());
    app.use(express.json());

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

    app.use(
        CFG.server.static.route,
        express.static(CFG.server.static.path, {
            index: CFG.server.static.index,
            cacheControl: CFG.server.static.cacheControl,
            maxAge: CFG.server.static.maxAge,
            etag: CFG.server.static.etag,
            dotfiles: CFG.server.static.dotfiles,
        }));

    PizzaRouter.setupRoutes(app, resources);

    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.listen(CFG.server.port);
}

main();
