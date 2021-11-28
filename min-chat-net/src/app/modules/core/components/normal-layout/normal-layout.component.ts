import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';
import { AuthService } from '@modules/core/services/auth.service';


@Component({
  selector: 'app-normal-layout',
  templateUrl: './normal-layout.component.html',
  styleUrls: ['./normal-layout.component.scss']
})
export class NormalLayoutComponent implements OnInit, OnDestroy {

  currentUser?: UserModel;

  private readonly _subscriptions: Subscription[];

  constructor(private _globalStateService: GlobalStateService,
    private _authService: AuthService) {
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

  onLogout() {
    this._authService.logout();
  }
}
