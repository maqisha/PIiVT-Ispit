import * as Ajv from "ajv";
import { PizzaOrder } from "../model";

const ajv = Ajv();

interface IAddOrder {
    pizzaOrders: PizzaOrder[],
    comment: string,
}

const IAddToCartValidator = ajv.compile({
    type: "object",
    properties: {
        comment: {
            type: "string",
        },
        pizzaOrders: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    pizzaId: {
                        type: "integer",
                        minimum: 1
                    },
                    quantity: {
                        type: "integer",
                        minimum: 1
                    },
                    size: {
                       enum: ['small', 'medium', 'large']
                    }
                },
                required: [
                    "pizzaId",
                    "quantity",
                    "size",
                ],
            }
        }
    },
    required: [
        "pizzaOrders",
    ],
    additionalProperties: false,
});

export default IAddOrder;
export { PizzaOrder }
export { IAddToCartValidator };