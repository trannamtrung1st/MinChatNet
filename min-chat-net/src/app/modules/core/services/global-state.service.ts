import { Injectable } from '@angular/core';
import { UserModel } from '@modules/identity/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    get currentUser(): UserModel | undefined { return this._currentUser; }
    get currentUser$(): Observable<UserModel | undefined> { return this._currentUser$; }

    private readonly _currentUser$: BehaviorSubject<UserModel | undefined>;
    private _currentUser?: UserModel;

    constructor() {
        this._currentUser$ = new BehaviorSubject<UserModel | undefined>(undefined);
    }

    setCurrentUser(user?: UserModel) {
        this._currentUser = user;
        this._currentUser$.next(user);
    }
}
