import * as Ajv from "ajv";

interface IUserLogin {
    email: string;
    password: string;
}

const ajv = new Ajv();

const IUserLoginValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            pattern: "[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+",
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
        }
    },
    required: [
        "email",
        "password"
    ],
    additionalProperties: false,
});

export { IUserLogin };
export { IUserLoginValidator };