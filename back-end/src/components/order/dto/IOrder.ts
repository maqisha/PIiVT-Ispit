import * as Ajv from "ajv";
import { CartItemModel } from "../model";

const ajv = Ajv();

interface IAddOrder {
    cartItems: CartItemModel[],
    comment: string,
}

const IAddOrderValidator = ajv.compile({
    type: "object",
    properties: {
        comment: {
            type: "string",
        },
        cartItems: {
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
                additionalProperties: true,
            }
        }
    },
    required: [
        "comment",
        "cartItems",
    ],
    additionalProperties: false,
});

export default IAddOrder;
export { IAddOrderValidator };