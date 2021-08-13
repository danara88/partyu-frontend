import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../models/userProfile.model';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: UserProfile;
  public displayModalLogout: boolean;
  public firstLetter: string;
  public searchedEvents: Event[];

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) {

    this.user = this.authService.getIdentity()!;
    this.displayModalLogout = false;
    this.firstLetter = '';
    this.searchedEvents = [];

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

  /**
   * Search an event
   * @param term 
   */
  searchEvent(term: string) {
    this.searchedEvents = [];

    if (term.length <= 3) return;

    this.utilsService.searchData('events', term).subscribe((results: Event[]) => {
      this.searchedEvents = results;
    }, error => {
      this.searchedEvents = [];
      console.log(error);
    });
  }

  /**
   * Clear the search bar and searches
   */
  clearSearch(term: any) {
    this.searchedEvents = [];
    term.value = "";
  }


}
