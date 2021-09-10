import * as Ajv from "ajv";

interface IEditUser {
    name: string,
    password: string,
    phoneNumber: string,
    address: string,
}

const ajv = Ajv();

const IEditUserValidator = ajv.compile({
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
    },
    required: [
        "name",
        "phoneNumber",
        "address",
        "password",
    ],
    additionalProperties: false,
})

export { IEditUser };
export { IEditUserValidator };