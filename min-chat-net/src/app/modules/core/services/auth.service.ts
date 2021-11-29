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

  async loginFromFirebase(fbUser: firebaseAuth.User) {
    const auth = await this.getFirebaseAuth();
    auth.currentUser?.getIdToken(true).then((idToken: string) => {
      const url = new URL('/api/auth/token', environment.apiUrl);
      this._httpClient.post<TokenResponseModel>(url.toString(), { idToken })
        .subscribe((tokenResponse) => {
          sessionStorage.setItem('accessToken', tokenResponse.accessToken);
          const user = this._getUserFromFirebase(fbUser);
          this.login(user);
        });
    }).catch((error) => {
      console.error(error);
    });
  }

  login(user: UserModel) {
    this._globalStateService.setCurrentUser(user);
    this._router.navigateByUrl('/');
  }

  async logout(): Promise<void> {
    this._globalStateService.setCurrentUser(undefined);
    sessionStorage.removeItem('accessToken');
    const auth = await this.getFirebaseAuth();
    await auth.signOut();
    this._router.navigateByUrl('/identity/login');
  }

  async getCurrentUser(): Promise<UserModel | undefined> {
    if (this._globalStateService.currentUser) return this._globalStateService.currentUser;
    const auth = await this.getFirebaseAuth();
    if (auth.currentUser) {
      const user = this._getUserFromFirebase(auth.currentUser);
      this._globalStateService.setCurrentUser(user);
      return user;
    }
    return undefined;
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
