import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../models/userProfile.model';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: UserProfile;
  public displayModalLogout: boolean;
  public firstLetter: string;

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) {

    this.user = this.authService.getIdentity()!;
    this.displayModalLogout = false;
    this.firstLetter = '';

  }

  /**
   * It gets the first leter for profile image
   */
  get firstLetterName(){
    return this.user.fullname[0]?.toUpperCase();
  }

  ngOnInit(): void {
    this.firstLetter = this.utilsService.getFirstLetter(this.user.fullname);
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
    this.displayModalLogout = true;
  }


}
