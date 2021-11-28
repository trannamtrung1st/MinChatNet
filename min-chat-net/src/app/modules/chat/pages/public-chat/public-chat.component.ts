import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';


@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit, OnDestroy {

  currentUser?: UserModel;

  private readonly _subscriptions: Subscription[];

  constructor(private _globalStateService: GlobalStateService) {
    this._subscriptions = [];
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._globalStateService.currentUser$.subscribe(user => this.currentUser = user)
    );
  }

}
