import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import * as firebaseAuth from "firebase/auth";

import { UserModel } from '@modules/identity/models/user.model';

import { GlobalStateService } from './global-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _globalStateService: GlobalStateService,
    private _router: Router) { }

  loginFromFirebase(fbUser: firebaseAuth.User) {
    const user = this._getUserFromFirebase(fbUser);
    this.login(user);
  }

  login(user: UserModel) {
    this._globalStateService.setCurrentUser(user);
    this._router.navigateByUrl('/');
  }

  async logout(): Promise<void> {
    this._globalStateService.setCurrentUser(undefined);
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
