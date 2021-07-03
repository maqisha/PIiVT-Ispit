import * as express from "express";
import * as cors from "cors";
import CFG from "./config/dev";
import PizzaService from "./components/pizza/service";
import PizzaController from "./components/pizza/controller";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use(
    CFG.server.static.route,
    express.static(CFG.server.static.path, {
        index: CFG.server.static.index,
        cacheControl: CFG.server.static.cacheControl,
        maxAge: CFG.server.static.maxAge,
        etag: CFG.server.static.etag,
        dotfiles: CFG.server.static.dotfiles,
    }));

const pizzaService: PizzaService = new PizzaService();
const pizzaController: PizzaController = new PizzaController(pizzaService);

app.get("/pizza", pizzaController.getAll.bind(pizzaController));

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(CFG.server.port);