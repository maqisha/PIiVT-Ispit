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
    }
}

export default CFG;