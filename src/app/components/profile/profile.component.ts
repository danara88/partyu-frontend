import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/userProfile.model';
import { UtilsService } from '../../services/utils.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  public displayModal: boolean;
  public user: UserProfile;

  public loader: boolean;
  public firstLetter: string;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private messageService: MessageService,
  ) { 
    this.displayModal = false;
    this.user = new UserProfile('','');

    this.loader = true;
    this.firstLetter = '';
  }

  ngOnInit(): void {
    this.getProfileData();
  }

  /**
   * Show the dialog modal to recover password
   **/
  showModalDialog() {
    this.displayModal = true;
  }

  /**
   * Get User Profile Data
   */
  getProfileData() {
    this.userService.getUserProfile().subscribe(user => {
      this.user = user;
      this.firstLetter = this.utilsService.getFirstLetter(this.user.fullname);
      this.loader = false;
      
    }, err => {
      console.log(err);
      this.loader = false;
      this.utilsService.showToastMessage('profileToast', 'error', 'Profile Data', 'Something went wrong ...', this.messageService);
    });
  }

}
