import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from 'src/app/models/event.model';7
import { EventsService } from '../../services/events.service';
import { UtilsService } from '../../services/utils.service';
import { ParticipantService } from '../../services/participant.service';
import { UserProfile } from '../../models/userProfile.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  public events: Event[];
  public loader: boolean;
  public skeletons: number[];
  public user: UserProfile;

  constructor(
    private messageService: MessageService,
    private eventsService: EventsService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
  ) {

    this.events = [];
    this.loader = true;
    this.skeletons = [1,2,3,4,5,6,7,8,9,10];
    this.user = this.authService.getIdentity()!;

  }

  ngOnInit(): void {
    this.getMyEvents();
  }

  /**
   * Get User Events
   */
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

  reloadEvents(event: boolean) {
    if (event) this.getMyEvents();
  }


}
