import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicChatComponent } from './pages/public-chat/public-chat.component';


const routes: Routes = [
  { path: '', component: PublicChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
