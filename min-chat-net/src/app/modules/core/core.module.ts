import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

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
    NzDropDownModule
  ],
  exports: [
    NormalLayoutComponent
  ]
})
export class CoreModule { }
