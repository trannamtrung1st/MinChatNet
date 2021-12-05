import { Component, OnDestroy, OnInit } from '@angular/core';

import { filter, Subscription } from 'rxjs';

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit, OnDestroy {

  pageVisible: boolean;
  currentUser?: UserModel;
  roomId?: string;
  hubConnection?: HubConnection;

  private readonly _subscriptions: Subscription[];

  constructor(private _globalStateService: GlobalStateService) {
    this._subscriptions = [];
    this.pageVisible = false;
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._globalStateService.setIsInPrivateChat(false);
    this._subscriptions.push(
      this._globalStateService.currentUser$.subscribe(user => this.currentUser = user),
      this._globalStateService.publicData$.pipe(
        filter(data => !!data)
      ).subscribe(data => {
        this.pageVisible = true;
        this.roomId = data?.publicRoomId;
        this._connectHub();
      })
    );
  }

  private _connectHub() {
    const hubUrl = new URL("/hub/chat", environment.apiUrl);
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl.toString(), { accessTokenFactory: () => sessionStorage.getItem('accessToken') as string })
      .build();

    this.hubConnection.start()
      .then(() => { })
      .catch((err) => console.error(err));
  }
}
