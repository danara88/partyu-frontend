import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public displayModal: boolean;

  constructor(
    private router: Router
  ) {

    this.displayModal = false;

  }

  ngOnInit(): void {
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

}
