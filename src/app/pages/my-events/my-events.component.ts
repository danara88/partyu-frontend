import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from 'src/app/models/event.model';7
import { EventsService } from '../../services/events.service';
import { UtilsService } from '../../services/utils.service';
import { ParticipantService } from '../../services/participant.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  public events: Event[];
  public loader: boolean;
  public skeletons: number[];

  constructor(
    private messageService: MessageService,
    private eventsService: EventsService,
    private participantService: ParticipantService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
  ) {

    this.events = [];
    this.loader = true;
    this.skeletons = [1,2,3,4,5,6,7,8,9,10];

  }

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {
    this.spinner.show();
    this.eventsService.getMyEventsParticipation(true).subscribe(events => {
      this.events = events;
      this.loader = false;
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', error.error.message, this.messageService);
      this.loader = false;
      this.spinner.hide();

    });
  }

  /**
   * This method will allow users to attend to an event
   * @param event 
  */
  attendToEvent(event: Event) {
    this.spinner.show();
    this.participantService.attendToEvent(event._id!).subscribe(participant => {
      this.utilsService.showToastMessage('homeToast', 'success', 'Attend to event', `You confirm your place in ${event.title} !`, this.messageService);
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', error.error.message, this.messageService);
    
    })
 }

  /**
   * This method will allow users to attend to an event
   * @param event 
   */
  notAttendToEvent(event: Event) {
    this.spinner.show();
    this.participantService.notAttendToEvent(event._id!).subscribe(participant => {
      this.utilsService.showToastMessage('homeToast', 'success', 'Not Attend to event', `Your participation was removed`, this.messageService);
      this.spinner.hide();
      this.events.splice(this.events.indexOf(event), 1);

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', 'Something went wrong', this.messageService);
    
   })
}

}
