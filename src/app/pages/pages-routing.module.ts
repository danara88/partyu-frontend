import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'my-events',
                component: MyEventsComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'notifications',
                component: NotificationsPageComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'calendar',
                component: CalendarComponent,
                canActivate: [ AuthGuard ]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule
    ]
})
export class PagesRoutingModule {}