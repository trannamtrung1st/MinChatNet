import { Component, Input, OnInit } from '@angular/core';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { randomUser } from '@modules/chat/helpers/user.helper';

import { environment } from '@environments/environment';

import { MessageModel } from '@modules/chat/models/message.model';
import { UserModel } from '@modules/user/models/user.model';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  @Input() currentUser!: UserModel;

  hubConnection!: HubConnection;
  connected: boolean;
  chatContent: MessageModel[];

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
    this.hubConnection.invoke('SendMessage', this.currentUser.displayName, content).catch((err) => console.error(err));
  }

  private _receiveMessage(displayName: string, content: string) {
    const isMine = this.currentUser.displayName === displayName;
    this.chatContent.unshift({
      content,
      fromUser: isMine ? this.currentUser : randomUser(displayName),
      isMine,
      isSameUser: this.chatContent.length ? this.chatContent[0].fromUser.displayName === displayName : false
    });
  }

  private _connectHub() {
    const hubUrl = new URL("/hub/chat", environment.apiUrl);
    this.hubConnection = new HubConnectionBuilder().withUrl(hubUrl.toString()).build();

    this.hubConnection.on("receiveMessage", (displayName: string, content: string) =>
      this._receiveMessage(displayName, content));

    this.hubConnection.start()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => console.error(err));
  }
}