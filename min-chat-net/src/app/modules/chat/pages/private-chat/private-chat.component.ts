import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent implements OnInit, OnDestroy {

  hubConnection?: HubConnection;
  pageVisible: boolean;
  currentUser?: UserModel;
  roomId: string;
  joinLink: string;

  private readonly _subscriptions: Subscription[];

  constructor(private _globalStateService: GlobalStateService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {
    this._subscriptions = [];
    this.pageVisible = false;
    this.roomId = '';
    this.joinLink = '';
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.roomId = paramMap.get('roomId') || '';
      if (!this.roomId) {
        this._router.navigateByUrl('/');
        return;
      }
      this._subscriptions.push(
        this._globalStateService.currentUser$.subscribe(user => this.currentUser = user),
      );
      this._joinPrivateRoom();
    });
  }

  private _joinPrivateRoom() {
    const hubUrl = new URL("/hub/chat", environment.apiUrl);
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl.toString(), { accessTokenFactory: () => sessionStorage.getItem('accessToken') as string })
      .build();

    this.hubConnection.start()
      .then(() => {
        this.hubConnection?.invoke('JoinPrivateRoom', this.roomId)
          .then(() => {
            this._globalStateService.setIsInPrivateChat(true);
            this.pageVisible = true;
            this.joinLink = location.href;
          });
      })
      .catch((err) => console.error(err));
  }

}
