import IConfig from "../common/IConfig.interface";

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
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "pizzeria",
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
}

export default CFG;