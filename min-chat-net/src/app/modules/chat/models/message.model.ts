import { UserModel } from "@modules/user/models/user.model";

export interface MessageModel {
    content: string;
    fromUser: UserModel;
    isMine: boolean;
    isSameUser: boolean;
}