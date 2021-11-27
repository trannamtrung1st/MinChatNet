import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { ChatRoutingModule } from './chat-routing.module';

import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { PublicChatComponent } from './pages/public-chat/public-chat.component';
import { MessageInputComponent } from './components/chat-box/message-input/message-input.component';
import { UserMessageComponent } from './components/chat-box/user-message/user-message.component';


@NgModule({
  declarations: [
    PublicChatComponent,
    ChatBoxComponent,
    MessageInputComponent,
    UserMessageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzAvatarModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
