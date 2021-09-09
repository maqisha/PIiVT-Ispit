import * as mysql2 from "mysql2/promise";
import IServices from "./IServices.interface";

export default interface IApplicationResources {
    conn: mysql2.Connection;
    services?: IServices
}