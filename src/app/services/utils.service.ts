import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/userProfile.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * It gets the first leter for profile image
   */
  getFirstLetter(term: string): string {
    return term[0].toUpperCase();
  }

  /**
   * Show Toast Notification Message
   * @param key 
   * @param severity 
   * @param summary 
   * @param detail 
   */
  showToastMessage(key: string, severity: string, summary: string, detail: string, messageService: MessageService) {
    messageService.add({
      key: key, 
      severity: severity, 
      summary: summary, 
      detail: detail,
      life: 2000,
      closable: false
    });
  }

   /**
   * Get User Profile Info
   * @returns 
   */
  getUserProfileData(userService: UserService): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
        userService.getUserProfile().subscribe(userProfile => {
        resolve(userProfile);
      }, error => {
        reject(error);
      });
    });
  }

  
  /**
   * Get a custom date format 
   * Ex. Saturday, August 7, 2021
   * @param myDate 
   * @returns 
   */
   getDateFormat(myDate: string | Date): string {
    const dateFormatted = new Date(myDate);
    
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(dateFormatted);
    const dayNumeric = new Intl.DateTimeFormat('en-US', { day: 'numeric'}).format(dateFormatted);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(dateFormatted);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric'}).format(dateFormatted);

    return `${ day }, ${ month } ${ dayNumeric }, ${ year }`;
  }

  /**
   * Get the hours of a date
   * ex. 16:29
   * @param myDate 
   * @returns 
   */
  getDateHour(myDate: string | Date): string {
    const dateFormatted = new Date(myDate);
    const time = new Intl.DateTimeFormat('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' }).format(dateFormatted);

    return time;
  }

  /**
   * Search data
   * @param collection 
   * @param term 
   */
  searchData(collection: string, term: string): Observable<any[]> {
    return this.http.get<{results: any[]}>(`${ this.apiUrl }api/search/${ collection }/${ term }`)
              .pipe(
                map((res) => {
                  return res.results
                })
              );
  }

}
