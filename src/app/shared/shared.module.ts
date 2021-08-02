import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';

import { MessageService } from 'primeng/api';

import { NgxSpinnerModule } from "ngx-spinner";
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    DialogModule,
    ToastModule,
    OverlayPanelModule,
    MessageModule,
    MessagesModule,
    SkeletonModule,
    TooltipModule,
    DropdownModule,
    CheckboxModule
  ],
  exports: [
    NgxSpinnerModule,
    DialogModule,
    ToastModule,
    OverlayPanelModule,
    MessageModule,
    MessagesModule,
    SkeletonModule,
    TooltipModule,
    DropdownModule,
    CheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    MessageService
  ]
})
export class SharedModule { }
