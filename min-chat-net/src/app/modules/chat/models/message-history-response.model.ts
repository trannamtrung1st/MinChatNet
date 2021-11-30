import { MessageModel } from "./message.model";

export interface MessageHistoryResponseModel {
    isOldest: boolean;
    messages: MessageModel[];
}