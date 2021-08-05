import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Invitation } from 'src/app/models/invitation.model';
import { InvitationService } from '../../services/invitation.service';
import { MessageService } from 'primeng/api';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  public initialInvitations: Invitation[];
  public loader: boolean;

  constructor(
    private invitationService: InvitationService,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) {

    this.initialInvitations = [];
    this.loader = true;

   }

  ngOnInit(): void {
    this.getInvitations(4);
  }

  /**
   * Get invitations
   */
  getInvitations(limit: number) {
    this.loader = true;
    this.invitationService.getMyInvitations(limit).subscribe(resp => {
      this.initialInvitations = resp.invitations;
      this.loader = false;
  
    }, error => {
      console.log(error);
      this.loader = false;
      if(error.error.message) {
        this.utilsService.showToastMessage('homeToast', 'error', 'List Notifications', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('homeToast', 'error', 'List Notifications', 'Something went wrong ...', this.messageService);
      }
    });
  }

  /**
   * Accept or Reject an invitation 
   * @param invitation 
   */
  acceptOrRejectInvitation(invitation: Invitation, accept: boolean = true) {
    this.spinner.show();

    let service;
    let message: string;

    if (accept) {
      service = this.invitationService.acceptInvitation(invitation);
      message = `You have accepted the invitation for ${invitation.event.title}!`;
    } else {
      service = this.invitationService.rejectInvitation(invitation);
      message = `You have rejected the invitation for ${invitation.event.title}`;
    }

    service.subscribe(invitation => {
      this.spinner.hide();
      this.utilsService.showToastMessage('homeToast', 'success', 'Response Invitation', message, this.messageService);
      this.getInvitations(4); 
    }, error => {
      console.log(error);
      this.spinner.hide();
      if(error.error.message) {
        this.utilsService.showToastMessage('homeToast', 'error', 'Response Invitation', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('homeToast', 'error', 'Response Invitation', 'Something went wrong ...', this.messageService);
      }

    });
  }

 



}
