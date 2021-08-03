import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LateralMenuComponent } from './lateral-menu/lateral-menu.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { EventComponent } from './event/event.component';
import { CreateEventComponent } from './create-event/create-event.component';


@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent,
    ProfileComponent,
    EventComponent,
    CreateEventComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ForgotPasswordComponent,
    LateralMenuComponent,
    HeaderComponent,
    ProfileComponent,
    EventComponent,
    CreateEventComponent
  ]
})
export class ComponentsModule { }
