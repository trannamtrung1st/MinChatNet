import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { EMOJI_MAP } from '@modules/chat/chat.constant';


@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit, OnChanges {

  @ViewChild('messageElement') _messageElement!: ElementRef<HTMLTextAreaElement>;

  @Input() disabled: boolean;

  @Output() send = new EventEmitter<string>();

  messageControl!: FormControl;
  emojiVisible: boolean;

  constructor(private _formBuilder: FormBuilder) {
    this.disabled = true;
    this.emojiVisible = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && this.messageControl) {
      this.disabled ? this.messageControl.disable() : this.messageControl.enable();
    }
  }

  ngOnInit(): void {
    this._buildForm();
  }

  onSend() {
    this._emitSendMessage();
  }

  onAddEmoji(emojiEvent: EmojiEvent) {
    const nativeEmoji = emojiEvent.emoji.native;
    if (!nativeEmoji) return;
    this._insert(nativeEmoji);
  }

  onChangePopoverVisible(visible: boolean) {
    if (!visible) {
      this._messageElement.nativeElement.focus();
      // alert(this.messageControl.value);
    }
  }

  onMessageKeyPress(keyEvent: KeyboardEvent) {
    if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
      this._emitSendMessage();
      keyEvent.preventDefault();
    }
    if (keyEvent.key === ' ') {
      this._checkAndReplaceLastEmoji() && keyEvent.preventDefault();
    }
  }

  private _emitSendMessage() {
    if (this.messageControl.invalid) return;
    this._checkAndReplaceAllEmojis();
    const content: string = this.messageControl.value;
    this.send.emit(content);
    this.messageControl.setValue('');
  }

  private _checkAndReplaceLastEmoji(): boolean {
    const currentSelectionStart = this._messageElement.nativeElement.selectionStart;
    const currentContent: string = this.messageControl.value;
    const searchContent = currentContent.substring(0, currentSelectionStart);
    const lastBreakIdx = searchContent.lastIndexOf('\n');
    const lastSpaceIdx = searchContent.lastIndexOf(' ');
    const startFromIdx = lastSpaceIdx > lastBreakIdx ? lastSpaceIdx : lastBreakIdx;
    const lastWord = searchContent.substring(startFromIdx).trim();
    if (lastWord) {
      const emoji = EMOJI_MAP.map[lastWord];
      if (emoji) {
        const wordStart = startFromIdx + 1;
        const wordEnd = wordStart + lastWord.length;
        this._messageElement.nativeElement.setSelectionRange(wordStart, wordEnd);
        this._insert(emoji + ' ');
        return true;
      }
    }
    return false;
  }

  private _checkAndReplaceAllEmojis() {
    const currentContent: string = this.messageControl.value;
    const finalContent = currentContent.split('\n').map(line => {
      return line.split(' ')
        .map(word => {
          const emoji = EMOJI_MAP.map[word];
          return emoji || word;
        }).join(' ');
    }).join('\n');
    this.messageControl.setValue(finalContent);
  }

  private _buildForm() {
    this.messageControl = this._formBuilder.control(
      { value: '', disabled: this.disabled },
      [Validators.required]
    );
  }

  private _insert(insertedContent: string) {
    const selectionStart = this._messageElement.nativeElement.selectionStart;
    const selectionEnd = this._messageElement.nativeElement.selectionEnd;
    this._sendInsertCommand(insertedContent, selectionStart, selectionEnd);
  }

  private _sendInsertCommand(insertContent: string, start: number, end: number) {
    const currentContent: string = this.messageControl.value;
    const newContent = currentContent.substring(0, start)
      + insertContent
      + currentContent.substring(end);
    this.messageControl.setValue(newContent);
    const newPosition = start + insertContent.length;
    this._messageElement.nativeElement.setSelectionRange(newPosition, newPosition);
  }
}
