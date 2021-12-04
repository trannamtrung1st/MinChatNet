import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as firebaseAuth from "firebase/auth";
import * as firebaseui from 'firebaseui';

import { AuthService } from '@modules/core/services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  classObject: { [key: string]: any };
  guestLoginForm!: FormGroup;

  private _authUi?: firebaseui.auth.AuthUI;

  constructor(private _authService: AuthService,
    private _formBuilder: FormBuilder) {
    this.classObject = { 'login--hidden': true };
  }

  ngOnDestroy(): void {
    this._authUi?.delete();
  }

  ngOnInit() {
    this._authService.getFirebaseAuth()
      .then(async auth => {
        if (auth.currentUser) {
          await this._authService.loginFromFirebase();
        } else {
          this.classObject['login--hidden'] = false;
          this._startSignInFlow(auth);
        }
      });

    this.guestLoginForm = this._formBuilder.group({
      displayName: ['', [Validators.required]]
    });
  }

  onLoginAsGuest() {
    if (this.guestLoginForm.invalid) { return; }
    this._authService.loginAsGuest(this.guestLoginForm.value.displayName);
  }

  private _startSignInFlow(auth: firebaseAuth.Auth) {
    this._authUi = new firebaseui.auth.AuthUI(auth);
    const uiConfig: firebaseui.auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl: string) => {
          this._authService.loginFromFirebase();
          return false;
        },
        uiShown: () => {
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: location.origin,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
      ]
    };
    this._authUi.start('#firebaseui-auth-container', uiConfig);
  }

}
