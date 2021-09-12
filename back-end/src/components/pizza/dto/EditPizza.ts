import * as Ajv from "ajv";

interface IEditPizza {
    name: string,
    imagePath: string,
    price: number,
    ingredientIds: number[],
}

const ajv = Ajv();

const IEditPizzaValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        price: {
            type: "number",
            minimum: 1
        },
        ingredientIds: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "integer",
                minimum: 1,
            }
        },
        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$",
        },
    },
    required: [
        "name",
        "price",
        "ingredientIds",
    ],
    additionalProperties: false,
})

export { IEditPizza };
export { IEditPizzaValidator };