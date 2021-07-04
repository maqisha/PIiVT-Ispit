import * as Ajv from "ajv";

interface IEditPizza {
    name: string,
    imagePath: string,
    price: number
}

const ajv = Ajv();

const IEditCategoryValidator = ajv.compile({
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
            minimum: 1
        },
    },
    required: [
        "name",
        "imagePath",
        "price",
    ],
    additionalProperties: false,
})

export { IEditPizza };
export { IEditCategoryValidator };