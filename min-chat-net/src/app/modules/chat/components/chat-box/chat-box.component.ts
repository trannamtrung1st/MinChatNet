import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { map, Subscription, tap } from 'rxjs';

import { environment } from '@environments/environment';

import { MessageModel } from '@modules/chat/models/message.model';
import { UserModel } from '@modules/identity/models/user.model';
import { MessageViewModel } from '@modules/chat/view-models/message-view.model';
import { MessageHistoryResponseModel } from '@modules/chat/models/message-history-response.model';
import { SendMessageModel } from '@modules/chat/models/send-message.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';
import { MessageHistoryQueryModel } from '@modules/chat/models/message-history-query.model';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  @ViewChild('chatView', { static: true }) chatViewElement!: ElementRef<HTMLDivElement>;

  @Input() currentUser!: UserModel;
  @Input() roomId: string;
  @Input() hubConnection!: HubConnection;

  chatContent: MessageViewModel[];
  oldest: boolean;
  loading: boolean;

  private readonly _subscriptions: Subscription[];

  constructor(private _httpClient: HttpClient,
    private _globalStateService: GlobalStateService) {
    this.chatContent = [];
    this.oldest = true;
    this.loading = false;
    this._subscriptions = [];
    this.roomId = '';
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._getHistory(new Date())
      .subscribe((response) => {
        this.oldest = response.isOldest;
        this._appendHistory(response.messages);
        this._handleHubMethods();

        if (!this.oldest
          && this.chatViewElement.nativeElement.scrollHeight <= this.chatViewElement.nativeElement.clientHeight) {
          this.loading = true;
          this._loadMoreMessages();
        }
      });
  }

  onSendMessage(content: string) {
    this._sendMessage(content);
  }

  onScroll(event: any) {
    const chatView = this.chatViewElement.nativeElement;
    const topScroll = -(chatView.scrollHeight - chatView.offsetHeight);
    const loadingMargin = 7;
    const isScrollToTop = Math.abs(chatView.scrollTop - topScroll) < loadingMargin;
    if (isScrollToTop && !this.oldest && !this.loading) {
      this.loading = true;
      this._loadMoreMessages();
    }
  }

  private _sendMessage(content: string) {
    const messageModel: SendMessageModel = {
      content,
      roomId: this.roomId
    }
    this.hubConnection.invoke('SendMessage', messageModel).catch((err) => console.error(err));
    this.chatViewElement.nativeElement.scrollTop = 0;
  }

  private _receiveMessage(messageModel: MessageModel) {
    if (messageModel.roomId !== this.roomId) return;
    const isSameUser = this.chatContent.length ? this.chatContent[0].fromUser.userId === messageModel.fromUser.userId : false;
    this.chatContent.unshift(this._convertToViewModel(messageModel, isSameUser));
  }

  private _convertToViewModel(messageModel: MessageModel, isSameUser: boolean) {
    const messageViewModel: MessageViewModel = {
      ...messageModel,
      isMine: messageModel.fromUser.userId === this.currentUser.userId,
      isSameUser: isSameUser
    };
    return messageViewModel;
  }

  private _getHistory(previous: Date) {
    const url = new URL('/api/messages/history', environment.apiUrl);
    const params: MessageHistoryQueryModel = {
      previous: previous.toISOString(),
      roomId: this.roomId
    };
    return this._httpClient.get<MessageHistoryResponseModel>(url.toString(), {
      params: params as any
    }).pipe(
      tap(response => response.messages)
    );
  }

  private _loadMoreMessages() {
    const currentOldest = this.chatContent[this.chatContent.length - 1];
    this._getHistory(new Date(currentOldest.time)).subscribe(response => {
      this.oldest = response.isOldest;
      this._appendHistory(response.messages);
      this.loading = false;
    });
  }

  private _appendHistory(messages: MessageModel[]) {
    if (!messages.length) { return; }
    const chatLength = this.chatContent.length;
    let oldestMessage = chatLength > 0 ? this.chatContent[chatLength - 1] : undefined;
    if (oldestMessage) {
      const isSameUser = oldestMessage.fromUser.userId === messages[0].fromUser.userId;
      oldestMessage.isSameUser = isSameUser;
    }
    const messageViewModels = messages.map((message, idx, arr) => {
      let isSameUser = false;
      if (idx < arr.length - 1) {
        isSameUser = message.fromUser.userId === arr[idx + 1].fromUser.userId;
      }
      return this._convertToViewModel(message, isSameUser);
    });
    this.chatContent.push(...messageViewModels);
  }

  private _handleHubMethods() {
    this.hubConnection.on("ReceiveMessage", (messageModel: MessageModel) =>
      this._receiveMessage(messageModel));
  }
}