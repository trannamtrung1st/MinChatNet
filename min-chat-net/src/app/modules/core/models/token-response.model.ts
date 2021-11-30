import { UserModel } from "@modules/identity/models/user.model";

export interface TokenResponseModel {
    user: UserModel;
    accessToken: string;
}