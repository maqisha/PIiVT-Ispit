import BaseService from "../../common/BaseService";
import IAdaptModelOptions from "../../common/IAdaptModelOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddUser } from "./dto/IAddUser";
import UserModel from "./model";
import * as bcrypt from "bcrypt";
import { IEditUser } from "./dto/IEditUser";

class UserModelAdapterOptions implements IAdaptModelOptions {

}

class UserService extends BaseService<UserModel> {
    protected async adaptModel(data: any, options: Partial<IAdaptModelOptions>): Promise<UserModel> {
        const user: UserModel = new UserModel();

        user.userId = +(data.user_id);
        user.address = data.address;
        user.passwordHash = data.password_hash;
        user.phoneNumber = data.phone_number;
        user.email = data.email;
        user.isAdmin = !!data.is_admin;
        user.createdAt = new Date(data.created_at);
        user.name = data.name;

        return user;
    }

    public async getAll(): Promise<UserModel[] | null | IErrorResponse> {
        return await this.getAllFromTable("user", {});
    }

    public async getById(userId: number): Promise<UserModel | null | IErrorResponse> {
        return await this.getByIdFromTable("user", userId, {});
    }

    public async add(data: IAddUser): Promise<UserModel | IErrorResponse> {
        return new Promise<UserModel | IErrorResponse>(resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11);

            this.db.execute(
                "INSERT user SET email = ?, password_hash = ?, name = ?, address = ?, phone_number = ?, is_admin = 0",
                [
                    data.email,
                    passwordHash,
                    data.name,
                    data.address,
                    data.phoneNumber
                ])
                .then(async result => {
                    const newUserId: number = +((result[0] as any)?.insertId);
                    resolve(await this.getById(newUserId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

    public async edit(userId: number, data: IEditUser): Promise<UserModel | null | IErrorResponse> {
        return new Promise<UserModel | IErrorResponse>(async resolve => {
            const oldUser = await this.getById(userId);

            if (oldUser === null) return resolve(null);

            const passwordHash = bcrypt.hashSync(data.password, 11);

            this.db.execute(
                "UPDATE user SET password_hash = ?, name = ?, address = ?, phone_number = ? WHERE user_id = ?",
                [
                    passwordHash,
                    data.name,
                    data.address,
                    data.phoneNumber,
                    userId
                ])
                .then(async () => {
                    resolve(await this.getById(userId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

    public async delete(userId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                "DELETE FROM user WHERE user_id = ?;",
                [userId]
            )
                .then(result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "1 record deleted!"
                        })
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "Record could not be deleted!"
                        })
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }
}

export default UserService