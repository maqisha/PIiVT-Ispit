import IModel from "../../common/IModel.interface";

export default class UserModel implements IModel {
    userId: number;
    email: string;
    name: string;
    passwordHash: string;
    phoneNumber: string;
    address: string;
    isAdmin: boolean;
    createdAt: Date;
}