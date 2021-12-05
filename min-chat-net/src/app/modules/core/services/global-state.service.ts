import { Injectable } from '@angular/core';
import { UserModel } from '@modules/identity/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { PublicDataModel } from '../models/public-data.model';


@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    get currentUser(): UserModel | undefined { return this._currentUser; }
    get currentUser$(): Observable<UserModel | undefined> { return this._currentUser$; }
    get publicData$(): Observable<PublicDataModel | undefined> { return this._publicData$; }
    get isInPrivateChat$(): Observable<boolean> { return this._isInPrivateChat$; }

    private readonly _publicData$: BehaviorSubject<PublicDataModel | undefined>;
    private readonly _currentUser$: BehaviorSubject<UserModel | undefined>;
    private readonly _isInPrivateChat$: BehaviorSubject<boolean>;
    private _currentUser?: UserModel;

    constructor() {
        this._currentUser$ = new BehaviorSubject<UserModel | undefined>(undefined);
        this._publicData$ = new BehaviorSubject<PublicDataModel | undefined>(undefined);
        this._isInPrivateChat$ = new BehaviorSubject<boolean>(false);
    }

    setCurrentUser(user?: UserModel) {
        this._currentUser = user;
        this._currentUser$.next(user);
    }

    setIsInPrivateChat(value: boolean) {
        this._isInPrivateChat$.next(value);
    }

    setPublicData(publicData: PublicDataModel) {
        this._publicData$.next(publicData);
    }

    loadLocalUser() {
        const userStr = sessionStorage.getItem('localUser');
        if (userStr) {
            this.setCurrentUser(JSON.parse(userStr));
        }
    }
}
