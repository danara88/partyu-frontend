import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { OverlayPanel } from 'primeng/overlaypanel';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region } from '../../models/region.model';
import { RegionService } from '../../services/region.service';
import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { MessageService } from 'primeng/api';
import { UserProfile } from '../../models/userProfile.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayModal: boolean;
  public displayModalCreateEvent: boolean;

  public user: UserProfile;
  public regions: Region[];

  public eventForm: FormGroup;
  public firstLetter: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private regionService: RegionService,
    private eventService: EventsService,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {

    this.displayModal = false;
    this.displayModalCreateEvent = false;

    this.user = new UserProfile('','');
    this.regions = [];

    this.eventForm = new FormGroup({});
    this.firstLetter = '';

  }

  /**
   * It gets the first leter for profile image
   */
  get firstLetterName(){
    return this.user.fullname[0]?.toUpperCase();
  }

  ngOnInit(): void {
    this.getProfile();
    this.createForm();
    this.getRegions();
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
   * Get out of your session
   */
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  /**
   * Show the dialog modal to recover password
   */
  showModalDialog() {
    this.displayModal = true;
  }

  /**
   * Show the dialog modal to create an event
   */
  showModalDialogCreateEvent() {
    this.displayModalCreateEvent = true;
  }

  /**
   * Create the form to create events
   */
  createForm() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      region: ['', [Validators.required]],
      description: [],
      visibility: [0, [Validators.required]],
    });
  }

  /**
   * Create the Event
   * @param overlaypanel 
   * @returns 
   */
  onSubmit(overlaypanel: OverlayPanel) {
    if (this.eventForm.invalid) return;

    overlaypanel.hide();
    this.spinner.show();
    this.displayModalCreateEvent = false;
    let event: Event = new Event();

    event.title = this.eventForm.controls['title'].value,
    event.description = this.eventForm.controls['description'].value,
    event.visibility = 0,
    event.region = this.eventForm.controls['region'].value._id;

    if (this.eventForm.controls['visibility'].value){
      event.visibility = 1;
    }

    this.eventService.createEvent(event).subscribe(event => {
      this.spinner.hide();
      this.utilsService.showToastMessage('headerToastMessage', 'success', 'Create Event', 'The event was uploaded !', this.messageService);

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.utilsService.showToastMessage('headerToastMessage', 'error', 'Create Event', error.error.message, this.messageService);

    })

  }

  /**
   * Get Profile User Data
   */
  getProfile() {
    this.userService.getUserProfile().subscribe(userProfile => {
      this.user = userProfile;
      this.firstLetter = this.utilsService.getFirstLetter(this.user.fullname);

    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('headerToastMessage', 'error', 'Create Profile Data', error.error.message, this.messageService);

    });
  }

}
