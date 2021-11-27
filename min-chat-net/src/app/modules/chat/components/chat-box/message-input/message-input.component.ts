import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit, OnChanges {

  @Input() disabled: boolean;

  @Output() send = new EventEmitter<string>();

  messageControl!: FormControl;

  constructor(private _formBuilder: FormBuilder) {
    this.disabled = true;
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

  onMessageKeyPress(keyEvent: KeyboardEvent) {
    if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
      this._emitSendMessage();
      keyEvent.preventDefault();
    }
  }

  private _emitSendMessage() {
    if (this.messageControl.invalid) return;
    const content = this.messageControl.value;
    this.send.emit(content);
    this.messageControl.setValue('');
  }

  private _buildForm() {
    this.messageControl = this._formBuilder.control(
      { value: '', disabled: this.disabled },
      [Validators.required]
    );
  }
}
