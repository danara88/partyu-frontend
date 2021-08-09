import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from 'src/app/models/event.model';
import { EventsService } from '../../services/events.service';
import { UtilsService } from '../../services/utils.service';
import { ParticipantService } from '../../services/participant.service';
import { UserProfile } from '../../models/userProfile.model';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public events: Event[];
  public myParticipationsIDs: string[];
  public loader: boolean;
  public skeletons: number[];
  public displayModalConfirmDelete: boolean;
  public user: UserProfile;

  constructor(
    private messageService: MessageService,
    private eventsService: EventsService,
    private participantService: ParticipantService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) { 

    this.events = [];
    this.myParticipationsIDs = [];
    this.loader = true;
    this.skeletons = [1,2,3,4,5,6,7,8,9,10];
    this.displayModalConfirmDelete = false;
    this.user = this.authService.getIdentity()!;

  }

  async ngOnInit() {
    this.spinner.show();
    if (history.state.RegisterSuccess === true) {
      setTimeout(() => {
        this.utilsService.showToastMessage('RegisterSuccess', 'success', 'Successful Registration', `Welcome to PartyU, ${history.state.fullname}`, this.messageService);
      }, 500);
    }
    this.myParticipationsIDs = await this.getMyParticipationsIDs();
    this.getAllEvents();
  }

  /**
   * Get All the Events
   */
  getAllEvents() {
    this.eventsService.getEvents().subscribe(resp => {
      this.events = resp.events;
      this.loader = false;
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'List Events', error.error.message, this.messageService);

    });
  }

  /**
   * Method to get all the events that the user is participating
   * @returns 
   */
  getMyParticipationsIDs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.participantService.getMyParticipations().subscribe((participations) => {
        let myEventsParticipationIDs: string[] = participations.map((participation: any) => participation.event.toString());
        resolve(myEventsParticipationIDs);

      }, error => {
        reject(error);
      });
    });
  }

}
