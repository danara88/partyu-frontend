import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { OverlayPanel } from 'primeng/overlaypanel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/userProfile.model';
import { Region } from '../../models/region.model';
import { RegionService } from 'src/app/services/region.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MessageService } from 'primeng/api';
import { InvitationService } from 'src/app/services/invitation.service';
import { User } from 'src/app/models/user.model';
import { Event } from '../../models/event.model';
import { UserService } from '../../services/user.service';
import { Invitation } from 'src/app/models/invitation.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  @Input() public headerOverlaypanel: OverlayPanel | null = null;

  public user: UserProfile;
  public users: User[];
  public selectedUsers: User[];
  public filteredUsers: User[];

  public displayModal: boolean;
  public displayModalInviteFriends: boolean;

  public regions: Region[];

  public eventForm: FormGroup;

  constructor(
    private authService: AuthService,
    private regionService: RegionService,
    private userService: UserService,
    private eventService: EventsService,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private invitationService: InvitationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {

    this.user = this.authService.getIdentity()!;
    this.users = [];
    this.selectedUsers = [];
    this.filteredUsers = [];
    
    this.displayModal = false;
    this.displayModalInviteFriends = false;

    this.regions = [];
    
    this.eventForm = new FormGroup({});

  }

  ngOnInit(): void {
    this.getRegions();
    this.createForm();
    this.loadUsers();
  }

   /**
   * Load Users for auto-complete input to invite friends
   */
  loadUsers() {
    if (this.user.role === 'ROLE_ADMIN') {
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        
      }, error => {
        console.log(error);
      });
    }
  }

  
  /**
   * Filter users for auto-complete input
   * @param event 
   */
  filterUser(event: any) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.users.length; i++) {
        let user = this.users[i];
        if (user.fullname.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(user);
        }
    }
    
    this.filteredUsers = filtered;
  }

  /**
   * Show the dialog modal
   */
  showModalDialog() {
    this.displayModal = true;
  }

  /**
   * Create the form to create events
   */
  createForm() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      region: ['', [Validators.required]],
      eventStart: [null, [Validators.required]],
      eventEnd: [null, [Validators.required]],
      description: [],
      visibility: [0, [Validators.required]],
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

  async onSubmit() {
    if (this.eventForm.invalid) return;

    this.headerOverlaypanel?.hide();
    this.spinner.show();
    this.displayModal = false;
    let event: Event = new Event();

    event.title = this.eventForm.controls['title'].value,
    event.description = this.eventForm.controls['description'].value,
    event.eventStart = new Date(this.eventForm.controls['eventStart'].value);
    event.eventEnd = new Date(this.eventForm.controls['eventEnd'].value);
    event.visibility = 0,
    event.region = this.eventForm.controls['region'].value._id;

    if (this.eventForm.controls['visibility'].value){
      event.visibility = 1;
    }

    try {
      // Create the event
      let eventDB = await this.createEvent(event);

      // Invite users to the event
      this.selectedUsers.forEach(async (user) => {
        await this.inviteUser(user, eventDB);
      });
      
      // Success Message
      this.spinner.hide();
      this.utilsService.showToastMessage('headerToastMessage', 'success', 'Create Event', 'The event was uploaded !', this.messageService);

    } catch (error) {
      console.log(error);
      this.spinner.hide();

      if (error.error.message){
        this.utilsService.showToastMessage('headerToastMessage', 'error', 'Create Event', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('headerToastMessage', 'error', 'Create Event', 'Something went wrong ...', this.messageService);
      }
      
    }
  }

  /**
   * Create a new Event
   * @param event 
   * @returns 
   */
  createEvent(event: Event): Promise<Event> {
    return new Promise((resolve, reject) => {
      this.eventService.createEvent(event).subscribe(event => {
        resolve(event);
      }, error => {
        reject(error);
      })
    });
  }

  /**
   * invite user to a private event
   * @param user 
   * @param event 
   * @returns 
   */
  inviteUser(user: User, event: Event): Promise<Invitation> {
    let invitation: {user: string, event: string} = {
      user: user.uid!,
      event: event._id!,
    }
  
    return new Promise((resolve, reject) => {
      this.invitationService.inviteUser(invitation).subscribe(invitation => {
        resolve(invitation);
      }, error => {
        reject(error);
      });
    });
  }

}
