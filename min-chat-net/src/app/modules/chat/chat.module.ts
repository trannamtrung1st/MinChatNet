import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmojiData, EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiSearch, PickerModule } from '@ctrl/ngx-emoji-mart';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { ChatRoutingModule } from './chat-routing.module';
import { CoreModule } from '@modules/core/core.module';

import { EMOJI_MAP } from './chat.constant';

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
    EmojiModule,
    PickerModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzAvatarModule,
    NzPopoverModule,
    ChatRoutingModule,
    CoreModule
  ]
})
export class ChatModule {
  constructor(private _emojiSearch: EmojiSearch) {
    this._buildEmojiMap();
  }

  private _buildEmojiMap() {
    EMOJI_MAP.map = Object.entries(this._emojiSearch.emojisList).map(entry => entry[1] as EmojiData)
      .reduce((prev, current) => {
        const native = current.native;
        if (!native) return prev;
        if (current.colons) prev[current.colons] = native;
        if (current.emoticons) {
          current.emoticons.forEach(emoticon => prev[emoticon] = native);
        }
        return prev;
      }, EMOJI_MAP.map);
  }
}
