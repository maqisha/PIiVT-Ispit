import * as Ajv from "ajv";

interface IRefreshToken {
    refreshToken: string,
    role: 'administrator' | 'user',
}

const ajv = new Ajv();

const IRefreshTokenValidator = ajv.compile({
    type: "object",
    properties: {
        refreshToken: {
            type: "string",
        },
        role: {
            enum: ["administrator", "user"],
        },
    },
    required: [
        "refreshToken",
        "role",
    ],
    additionalProperties: false,
});

export { IRefreshToken };
export { IRefreshTokenValidator };