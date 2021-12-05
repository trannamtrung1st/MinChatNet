import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NormalLayoutComponent } from '@modules/core/components/normal-layout/normal-layout.component';
import { PublicChatComponent } from './pages/public-chat/public-chat.component';
import { PrivateChatComponent } from './pages/private-chat/private-chat.component';

import { AuthGuardService } from '@modules/core/services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: NormalLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'public', component: PublicChatComponent },
      { path: 'private/:roomId', component: PrivateChatComponent },
      { path: '', redirectTo: 'public' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
