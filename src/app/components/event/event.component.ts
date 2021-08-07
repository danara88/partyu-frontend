import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { ParticipantService } from '../../services/participant.service';
import { UtilsService } from '../../services/utils.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserProfile } from '../../models/userProfile.model';
import { Participant } from '../../models/participant';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() public events: Event[];
  @Input() public event: Event;
  @Input() public user: UserProfile;
  @Input() public myParticipationsIDs: string[];
  @Input() public showAdminOptions: boolean;
  @Input() public isMyEventsSection: boolean;
  @Output() public reloadEvents: EventEmitter<boolean> = new EventEmitter();

  public numberParticipants: number;
  public participants: Participant[];
  public displayModalParticipants: boolean;

  constructor(
    private eventsService: EventsService,
    private participantService: ParticipantService,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) { 

    this.events = [];
    this.event = {};
    this.user = new UserProfile('', '');
    this.myParticipationsIDs = [];
    this.showAdminOptions = true;
    this.isMyEventsSection = false;
    this.numberParticipants = 0;
    this.participants = [];
    this.displayModalParticipants = false;

  }

  ngOnInit(): void {
    this.getListParticipants();
  }

  
  /**
   * This method will allow users to attend to an event
   * @param event 
   */
  attendToEvent() {
    this.spinner.show();
    this.participantService.attendToEvent(this.event._id!).subscribe(participant => {
      this.utilsService.showToastMessage('homeToast', 'success', 'Attend to event', `You confirm your place in ${this.event.title} !`, this.messageService);
      this.spinner.hide();
      this.myParticipationsIDs.push(this.event._id!);

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', error.error.message, this.messageService);
      
    });
  }

  /**
   * This method will allow users to attend to an event
   * @param event 
   */
  notAttendToEvent() {
    this.spinner.show();
    this.participantService.notAttendToEvent(this.event._id!).subscribe(participant => {
      this.utilsService.showToastMessage('homeToast', 'success', 'Not Attend to event', `Your participation was removed`, this.messageService);
      this.myParticipationsIDs.splice(this.myParticipationsIDs.indexOf(this.event._id!), 1);
      if (this.isMyEventsSection) {
        this.reloadEvents.emit(true);
      }
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.spinner.hide();
      if (error.error.message) {
        this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('homeToast', 'error', 'Attend to event', 'Something went wrong', this.messageService);
      }  
    });
  }

  /**
   * Delete an event
   * @param event 
   */
  deleteEvent() {
    this.spinner.show();
    this.eventsService.deleteEvent(this.event).subscribe(event => {
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'success', 'Delete Event', `The event ${ event.title } was deleted`, this.messageService);
      this.events.splice(this.events.indexOf(event), 1);

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'Delete Event', 'Something went wrong', this.messageService);
    })
  }

  /**
   * Confirm if delete event or not
   * @param event 
   */
  confirm(event: Event) {
    this.confirmationService.confirm({
      message: `Are you want to delete event: ${event.title} ?`,
      accept: () => {
          this.deleteEvent();
      }
    });
  }

  /**
   * Get List Of Participants
   */
  getListParticipants() {
    this.participantService.listParticipantsByEvent(this.event).subscribe(resp => {
      this.numberParticipants = resp.total;
      this.participants = resp.participants;
    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('homeToast', 'error', 'List Participants', 'Something went wrong', this.messageService);
    });
  }

  showModalParticipants() {
    this.displayModalParticipants = true;
  }

}
