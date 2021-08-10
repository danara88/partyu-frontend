import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { EventsService } from '../../services/events.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from 'src/app/models/event.model';
import { RegionService } from '../../services/region.service';
import { Region } from 'src/app/models/region.model';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {

  @Input() public event: Event;
  @Input() public eventOptionsOverlaypanel: OverlayPanel | null = null;

  public regions: Region[];
  public updateEventForm: FormGroup;
  public displayModal: boolean;

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private utilsService: UtilsService,
    private regionService: RegionService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {

    this.event = new Event('');
    this.regions = [];
    this.displayModal = false;
    this.updateEventForm = new FormGroup({});

   }

  ngOnInit(): void {
    this.getRegions();
    this.createForm();
  }

  /**
   * Create the update event form
   */
  createForm() {
    this.updateEventForm = this.fb.group({
      title:       [this.event.title,       [Validators.required]],
      description: [this.event.description, [Validators.required]],
      region:      [this.event.region,                     [Validators.required]],
      eventStart:  [new Date(this.event.eventStart!),  [Validators.required]],
      eventEnd:    [new Date(this.event.eventEnd!),    [Validators.required]],
      visibility:  [this.event.visibility,  [Validators.required]]
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
    if (this.updateEventForm.invalid) return;
    this.eventOptionsOverlaypanel?.hide();
    this.spinner.show();
    this.displayModal = false;

    this.event.title = this.updateEventForm.controls['title'].value,
    this.event.description = this.updateEventForm.controls['description'].value,
    this.event.eventStart = new Date(this.updateEventForm.controls['eventStart'].value);
    this.event.eventEnd = new Date(this.updateEventForm.controls['eventEnd'].value);
    this.event.visibility = 0,
    this.event.region = this.updateEventForm.controls['region'].value._id;

    if (this.updateEventForm.controls['visibility'].value){
      this.event.visibility = 1;
    }

    // Call update event API
    try {
      await this.updateEvent(this.event);

      let regionId: any = this.event.region;
      this.event.region = await this.getRegionById(regionId);

      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'success', 'Update Event', 'The event was updated !', this.messageService);

    } catch (error) {
      console.log(error);
      this.spinner.hide();

      if (error.error.message){
        this.utilsService.showToastMessage('homeToast', 'error', 'Update Event', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('homeToast', 'error', 'Update Event', 'Something went wrong ...', this.messageService);
      }
    }

  }

  /**
   * Update Event
   * @param event 
   * @returns 
   */
  updateEvent(event: Event): Promise<Event> {
    return new Promise((resolve, reject) => {
      this.eventService.updateEvent(event).subscribe(event => {
        resolve(event);
      }, error => {
        reject(error);
      })
    });
  }

  /**
   * Get a region by region ID
   * @param regionId 
   * @returns 
   */
  getRegionById(regionId: any): Promise<Region> {
    return new Promise((resolve, reject) => {
      this.regionService.getRegionById(regionId).subscribe(region => {
        resolve(region);
      }, error => {
        reject(error);
      });
    });
  }


  /**
   * Show modal
   */
  showModal() {
    this.displayModal = true;
  }

}
