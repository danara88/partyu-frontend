import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'my-events',
                component: MyEventsComponent
            },
            {
                path: 'notifications',
                component: NotificationsPageComponent
            },
            {
                path: 'calendar',
                component: CalendarComponent
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