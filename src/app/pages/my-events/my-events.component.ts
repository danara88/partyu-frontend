import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from 'src/app/models/event.model';7
import { EventsService } from '../../services/events.service';
import { UtilsService } from '../../services/utils.service';
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
  public eventsVisibility: number;
  public optionsDropDown: object[];

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
    this.eventsVisibility = 1; // 1 -> Public Events, 2 -> private Events
    this.optionsDropDown = [{code: 1, label: 'My public events'}, {code: 2, label: 'My private events'}];

  }

  ngOnInit(): void {
    if (this.eventsVisibility === 1) {
      this.getMyPublicEvents();
    } else {
      this.getMyPrivateEvents();
    }
  }

  /**
   * Get User Events
   */
  getMyPublicEvents() {
    this.spinner.show();
    this.eventsService.getPublicEvents().subscribe(events => {
      this.events = events;
      this.loader = false;
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('homeToast', 'error', 'Get my events', error.error.message, this.messageService);
      this.loader = false;
      this.spinner.hide();

    });
  }

  /**
   * Get User Accpted Events
   */
  getMyPrivateEvents() {
    this.spinner.show();
    this.eventsService.getPrivateEvents().subscribe(events => {
      this.events = events;
      this.loader = false;
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('homeToast', 'error', 'Get my events', error.error.message, this.messageService);
      this.loader = false;
      this.spinner.hide();
    });
  }

  /**
   * Reload again all the public events
   * @param event 
   */
  reloadEvents(event: boolean) {
    if (event) this.getMyPublicEvents();
  }

  /**
   * Handler the value of dropdown filter
   * @param event 
   */
  handlerVisibility(event: any) {
    if(event.value.code === 1) {
      this.eventsVisibility = 1;
      this.getMyPublicEvents();
    } else {
      this.eventsVisibility = 2;
      this.getMyPrivateEvents();
    }
  }


}
