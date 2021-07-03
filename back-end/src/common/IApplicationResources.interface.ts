import * as mysql2 from "mysql2/promise";

export default interface IApplicationResources {
    conn: mysql2.Connection;
}