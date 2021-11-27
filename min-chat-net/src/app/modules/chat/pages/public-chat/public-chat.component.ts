import { Component, OnInit } from '@angular/core';

import { randomUser } from '@modules/chat/helpers/user.helper';

import { UserModel } from '@modules/user/models/user.model';

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit {

  currentUser: UserModel;

  constructor() {
    this.currentUser = randomUser(`Random guy ${Math.random() * 1000000}`);
  }

  ngOnInit(): void {
    this.currentUser.displayName = prompt('Input your username') || this.currentUser.displayName;
  }

}
