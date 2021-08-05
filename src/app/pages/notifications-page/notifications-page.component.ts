import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {

  public notificationsSection: number;

  constructor() { 

    this.notificationsSection = 1;

  }

  ngOnInit(): void {
  }

  showActualNotifications() {
    this.notificationsSection = 1;
  }

  showAllNotifications() {
    this.notificationsSection = 2;
  }

}
