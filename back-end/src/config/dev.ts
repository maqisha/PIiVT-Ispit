import IConfig from "./IConfig.interface";

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
    }
}

export default CFG;