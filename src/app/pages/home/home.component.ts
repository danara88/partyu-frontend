import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Event } from 'src/app/models/event.model';
import { EventsService } from '../../services/events.service';
import { UtilsService } from '../../services/utils.service';
import { ParticipantService } from '../../services/participant.service';
import { UserProfile } from '../../models/userProfile.model';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionService } from '../../services/region.service';
import { Region } from '../../models/region.model';


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
  public filterEventsForm: FormGroup;
  public regions: Region[];
  public activeFilter: boolean;

  constructor(
    private messageService: MessageService,
    private eventsService: EventsService,
    private participantService: ParticipantService,
    private regionService: RegionService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { 

    this.events = [];
    this.myParticipationsIDs = [];
    this.loader = true;
    this.skeletons = [1,2,3,4,5,6,7,8,9,10];
    this.displayModalConfirmDelete = false;
    this.user = this.authService.getIdentity()!;
    this.filterEventsForm = new FormGroup({});
    this.regions = [];
    this.activeFilter = false;

  }

  async ngOnInit() {
    this.spinner.show();
    if (history.state.RegisterSuccess === true) {
      setTimeout(() => {
        this.utilsService.showToastMessage('RegisterSuccess', 'success', 'Successful Registration', `Welcome to PartyU, ${history.state.fullname}`, this.messageService);
      }, 500);
    }
    this.getRegions();
    this.createForm();
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
   * Get All the Regions
   */
  getRegions() {
    this.regionService.getRegions().subscribe(resp => {
      this.regions = resp.regions;
    }, error => {
      console.log(error);
    })
  }

  /**
   * Create filter form
   */
  createForm() {
    this.filterEventsForm = this.fb.group({
      region: [null],
      eventStart: [null]
    });
  }

  /**
   * Filter events
   * @returns 
   */
  filter() {
    if (this.filterEventsForm.invalid) return;

    let eventStart = this.filterEventsForm.controls.eventStart.value || null;
    let region = this.filterEventsForm.controls.region.value ? this.filterEventsForm.controls.region.value._id : null;

    if (eventStart === null && region === null) {
      return;
    }

    if (eventStart) eventStart.toString();

    let filter: {eventStart: string, region: string} = {
      eventStart,
      region
    }

    this.activeFilter = true;
    this.spinner.show();

    this.eventsService.filterEvents(filter).subscribe(events => {
      this.spinner.hide();
      this.events = events;

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'error', 'Filter Events', 'Something went wrong', this.messageService);

    })

  }

  /**
   * Clear all filters
   */
  clearFilter() {
    if (this.activeFilter) {
      this.spinner.show();
      this.activeFilter = false;
      this.filterEventsForm.reset();
      this.getAllEvents();
    }
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
