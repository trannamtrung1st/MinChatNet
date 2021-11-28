import { Component, OnInit } from '@angular/core';

import * as firebase from "firebase/app";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

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
  }
}
