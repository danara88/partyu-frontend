import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '../shared/shared.module';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LateralMenuComponent } from './lateral-menu/lateral-menu.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent
  ]
})
export class ComponentsModule { }
