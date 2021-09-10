export default interface IConfig {
    server: {
        port: number,
        static: {
            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: "deny" | "allow",
            etag: boolean,
            index: boolean,
            maxAge: number,
        },
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: string,
        timezone: string,
    },
    fileupload: {
        maxSize: number,
        maxFiles: number,
        timeout: number,
        tempDir: string,
        uploadDir: string,
        photos: {
            limits: {
                minWidth: number,
                maxWidth: number,
                minHeight: number,
                maxHeight: number,
            },
            resizes: {
                sufix: string,
                width: number,
                height: number,
                fit: "cover"|"contain",
            }[]
        },
    },
    mail: {
        hostname: string,
        port: number,
        secure: boolean,
        username: string,
        password: string,
        fromMail: string,
        debug: boolean,
    }
};