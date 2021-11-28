import { UserModel } from "@modules/identity/models/user.model";

export interface MessageModel {
    content: string;
    fromUser: UserModel;
}