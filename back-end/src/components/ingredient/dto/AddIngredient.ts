import * as Ajv from "ajv";

interface IAddIngredient {
    name: string,
    price: number
}

const ajv = Ajv();

const IAddIngredientValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        price: {
            type: "number",
            minimum: 0
        },
    },
    required: [
        "name",
        "price",
    ],
    additionalProperties: false,
})

export { IAddIngredient };
export { IAddIngredientValidator };