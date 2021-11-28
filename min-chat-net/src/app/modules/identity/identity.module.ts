import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { IdentityRoutingModule } from './identity-routing.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
  ]
})
export class IdentityModule { }
