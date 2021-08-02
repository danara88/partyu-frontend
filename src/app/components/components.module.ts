import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LateralMenuComponent } from './lateral-menu/lateral-menu.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent,
    ProfileComponent,
  ]
})
export class ComponentsModule { }
