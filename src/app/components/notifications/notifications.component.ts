import { Component, OnInit } from '@angular/core';
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
    this.invitationService.getMyInvitations(limit).subscribe(resp => {
      this.initialInvitations = resp.invitations;
      this.loader = false;
  
    }, error => {
      console.log(error);
      this.loader = false;
      if(error.error.message) {
        this.utilsService.showToastMessage('homeToast', 'error', 'List Events', error.error.message, this.messageService);
      } else {
        this.utilsService.showToastMessage('homeToast', 'error', 'List Events', 'Something went wrong ...', this.messageService);
      }
    });
  }

}
