import IConfig from "../common/IConfig.interface";
import * as dotenv from "dotenv";

const dotEnvResult = dotenv.config()
if (dotEnvResult.error) throw "Environment configuration error: " + dotEnvResult.error;

const CFG: IConfig = {
    server: {
        port: 42051,
        static: {
            path: "./static/",
            route: "/static",
            cacheControl: true,
            dotfiles: "deny",
            maxAge: 3600000,
            etag: false,
            index: false,
        }
    },
    database: {
        host: process.env?.DATABASE_HOST,
        port: +(process.env?.DATABASE_PORT),
        user: process.env?.DATABASE_USER,
        password: process.env?.DATABASE_PASSWORD,
        database: process.env?.DATABASE_NAME,
        charset: "utf8",
        timezone: "+01:00",
    },
    fileupload: {
        maxSize: 5 * 1024 * 1024,
        maxFiles: 1,
        timeout: 30000,
        tempDir: '../temp/',
        uploadDir: 'static/uploads/',
        photos: {
            limits: {
                minWidth: 300,
                minHeight: 200,
                maxWidth: 1920,
                maxHeight: 1080,
            },
            resizes: [
                {
                    sufix: '-small',
                    fit: 'cover',
                    width: 400,
                    height: 300,
                },
                {
                    sufix: '-medium',
                    fit: 'cover',
                    width: 800,
                    height: 600,
                }
            ]
        }
    },
    mail: {
        hostname: process.env?.MAIL_HOST,
        port: +(process.env?.MAIL_PORT),
        secure: process.env?.MAIL_SECURE === "true",
        username: process.env?.MAIL_USERNAME,
        password: process.env?.MAIL_PASSWORD,
        fromMail: process.env?.MAIL_FROM,
        debug: true,
    }
}

export default CFG;