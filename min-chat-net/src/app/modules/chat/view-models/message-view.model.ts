import { MessageModel } from "../models/message.model";

export interface MessageViewModel extends MessageModel {
    isMine: boolean;
    isSameUser: boolean;
}