import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';
import { AuthService } from '@modules/core/services/auth.service';
import { environment } from '@environments/environment';
import { RoomModel } from '@modules/chat/models/room.model';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-normal-layout',
  templateUrl: './normal-layout.component.html',
  styleUrls: ['./normal-layout.component.scss']
})
export class NormalLayoutComponent implements OnInit, OnDestroy {

  currentUser?: UserModel;
  isInPrivate: boolean;

  private readonly _subscriptions: Subscription[];

  constructor(private _globalStateService: GlobalStateService,
    private _authService: AuthService,
    private _httpClient: HttpClient,
    private _router: Router) {
    this.isInPrivate = false;
    this._subscriptions = [];
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._globalStateService.currentUser$.subscribe(user => this.currentUser = user),
      this._globalStateService.isInPrivateChat$.subscribe(isInPrivate => this.isInPrivate = isInPrivate)
    );
  }

  onLeavePrivateRoom() {
    this._router.navigateByUrl('/');
  }

  onNewPrivateRoom() {
    const url = new URL('/api/rooms', environment.apiUrl);
    return this._httpClient.post<RoomModel>(url.toString(), null).subscribe((room) => {
      this._router.navigateByUrl(`/chat/private/${room.id}`);
    });
  }

  onLogout() {
    this._authService.logout();
  }
}
