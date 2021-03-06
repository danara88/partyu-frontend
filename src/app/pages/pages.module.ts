import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    MyEventsComponent,
    NotificationsPageComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
