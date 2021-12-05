import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NormalLayoutComponent } from './components/normal-layout/normal-layout.component';


@NgModule({
  declarations: [
    NormalLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzAvatarModule,
    NzGridModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule
  ],
  exports: [
    NormalLayoutComponent
  ]
})
export class CoreModule { }
