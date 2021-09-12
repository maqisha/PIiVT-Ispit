import * as Ajv from "ajv";
import IngredientModel from "../../ingredient/model";

interface IAddPizza {
    name: string,
    imagePath: string,
    price: number,
    ingredientIds: number[],
}

const ajv = Ajv();

const IAddPizzaValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$",
        },
        price: {
            type: "number",
            minimum: 1,
        },
        ingredientIds: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "number",
                minimum: 1,
            }
        }
    },
    required: [
        "name",
        "imagePath",
        "price",
        "ingredientIds",
    ],
    additionalProperties: false,
})

export { IAddPizza };
export { IAddPizzaValidator };