import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as firebaseAuth from "firebase/auth";

import { environment } from '@environments/environment';

import { TokenResponseModel } from '../models/token-response.model';
import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from './global-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _globalStateService: GlobalStateService,
    private _router: Router,
    private _httpClient: HttpClient) { }

  async loginFromFirebase() {
    const auth = await this.getFirebaseAuth();
    auth.currentUser?.getIdToken(true).then((idToken: string) => {
      const url = new URL('/api/auth/token', environment.apiUrl);
      this._httpClient.post<TokenResponseModel>(url.toString(), { idToken })
        .subscribe((tokenResponse) => {
          sessionStorage.setItem('accessToken', tokenResponse.accessToken);
          sessionStorage.setItem('localUser', JSON.stringify(tokenResponse.user));
          this.login(tokenResponse.user);
        });
    }).catch((error) => {
      console.error(error);
    });
  }

  loginAsGuest(displayName: string) {
    const url = new URL('/api/auth/guest/token', environment.apiUrl);
    this._httpClient.post<TokenResponseModel>(url.toString(), { displayName })
      .subscribe((tokenResponse) => {
        sessionStorage.setItem('accessToken', tokenResponse.accessToken);
        sessionStorage.setItem('localUser', JSON.stringify(tokenResponse.user));
        this.login(tokenResponse.user);
      });
  }


  login(user: UserModel) {
    this._globalStateService.setCurrentUser(user);
    this._router.navigateByUrl('/');
  }

  async logout(): Promise<void> {
    this._globalStateService.setCurrentUser(undefined);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('localUser');
    const auth = await this.getFirebaseAuth();
    await auth.signOut();
    this._router.navigateByUrl('/identity/login');
  }

  async getFirebaseAuth(): Promise<firebaseAuth.Auth> {
    const auth = firebaseAuth.getAuth();
    await auth.setPersistence(firebaseAuth.browserSessionPersistence);
    return auth;
  }

  private _getUserFromFirebase(fbUser: firebaseAuth.User) {
    const user: UserModel = {
      userId: fbUser.uid,
      avatar: fbUser.photoURL || '',
      displayName: fbUser.displayName || ''
    };
    return user;
  }
}
