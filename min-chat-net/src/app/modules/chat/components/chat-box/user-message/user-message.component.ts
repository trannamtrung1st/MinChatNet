import { Component, Input, OnInit } from '@angular/core';

import { MessageModel } from '@modules/chat/models/message.model';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnInit {

  @Input() message!: MessageModel;

  classObject: { [key: string]: any };

  constructor() {
    this.classObject = {};
  }

  ngOnInit(): void {
    this.classObject['message--mine'] = this.message.isMine;
    this.classObject['message--other'] = !this.message.isMine;
  }

}
