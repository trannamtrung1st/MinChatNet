import { Component, Input, OnInit } from '@angular/core';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { environment } from '@environments/environment';

import { MessageModel } from '@modules/chat/models/message.model';
import { UserModel } from '@modules/identity/models/user.model';
import { MessageViewModel } from '@modules/chat/view-models/message-view.model';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  @Input() currentUser!: UserModel;

  hubConnection!: HubConnection;
  connected: boolean;
  chatContent: MessageViewModel[];

  constructor() {
    this.connected = false;
    this.chatContent = [];
  }

  ngOnInit(): void {
    this._connectHub();
  }

  onSendMessage(content: string) {
    this._sendMessage(content);
  }

  private _sendMessage(content: string) {
    const messageModel: MessageModel = {
      content,
      fromUser: this.currentUser
    }
    this.hubConnection.invoke('SendMessage', messageModel).catch((err) => console.error(err));
  }

  private _receiveMessage(messageModel: MessageModel) {
    const isSameUser = this.chatContent.length ? this.chatContent[0].fromUser.userId === messageModel.fromUser.userId : false;
    const messageViewModel: MessageViewModel = {
      ...messageModel,
      isMine: messageModel.fromUser.userId === this.currentUser.userId,
      isSameUser: isSameUser
    }
    this.chatContent.unshift(messageViewModel);
  }

  private _connectHub() {
    const hubUrl = new URL("/hub/chat", environment.apiUrl);
    this.hubConnection = new HubConnectionBuilder().withUrl(hubUrl.toString()).build();

    this.hubConnection.on("ReceiveMessage", (messageModel: MessageModel) =>
      this._receiveMessage(messageModel));

    this.hubConnection.start()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => console.error(err));
  }
}