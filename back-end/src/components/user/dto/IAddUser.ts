import * as Ajv from "ajv";

interface IAddUser {
    email: string,
    name: string,
    password: string,
    phoneNumber: string,
    address: string,
}

const ajv = Ajv();

const IAddUserValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 64,
        },
        phoneNumber: {
            type: "string",
            minLength: 1,
            maxLength: 24,
        },
        address: {
            type: "string",
            minLength: 1,
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
        },
        email: {
            type: "string",
            pattern: "[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+",
        }
    },
    required: [
        "name",
        "phoneNumber",
        "address",
        "password",
        "email",
    ],
    additionalProperties: false,
})

export { IAddUser };
export { IAddUserValidator };