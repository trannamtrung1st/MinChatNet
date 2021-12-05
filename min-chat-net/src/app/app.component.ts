import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as firebase from "firebase/app";

import { environment } from '@environments/environment';

import { PublicDataModel } from '@modules/core/models/public-data.model';

import { GlobalStateService } from '@modules/core/services/global-state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _globalStateService: GlobalStateService,
    private _httpClient: HttpClient) { }

  async ngOnInit() {
    const firebaseConfig: firebase.FirebaseOptions = {
      apiKey: "AIzaSyD2W6PnKcP05ViRuIEzQDvrH-8O3zkBJ1E",
      authDomain: "min-chat-net.firebaseapp.com",
      projectId: "min-chat-net",
      storageBucket: "min-chat-net.appspot.com",
      messagingSenderId: "608456063222",
      appId: "1:608456063222:web:26f38e6048bf78ff0154d7"
    };

    const app = firebase.initializeApp(firebaseConfig);

    this._globalStateService.loadLocalUser();

    this._getPublicData();
  }

  private _getPublicData() {
    const url = new URL('/api/public', environment.apiUrl);
    return this._httpClient.get<PublicDataModel>(url.toString()).subscribe((data) => {
      this._globalStateService.setPublicData(data);
    });
  }
}
