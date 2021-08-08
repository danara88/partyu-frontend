import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { CalendarOptions } from '@fullcalendar/angular';
import { EventCalendar } from 'src/app/models/eventCalendar.model';
import { EventsService } from '../../services/events.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public calendarOptions: CalendarOptions;
  public eventsCalendar: EventCalendar[];


  constructor(
    private eventService: EventsService,
    private spinner: NgxSpinnerService,
  ) { 

    this.calendarOptions = {};
    this.eventsCalendar = [];

  }

  async ngOnInit() {
    this.spinner.show();
    this.eventsCalendar = await this.getEventsCalendar();
    this.calendarConfig(this.eventsCalendar);
  }

  /**
   * Calendar options settings
   */
  calendarConfig(eventsCalendar: EventCalendar[]) {
    this.spinner.hide();
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      events: eventsCalendar
    };
  }

  /**
   * Get events user to display in calendar
   * @returns 
   */
  getEventsCalendar(): Promise<EventCalendar[]> {
    return new Promise((resolve, reject) => {
      this.eventService.getMyEventCalendar().subscribe(events => {
        resolve(events);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

}
