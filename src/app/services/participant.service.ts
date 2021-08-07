import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Participant } from '../models/participant';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Attent to an Event/Party
   * @param event 
   * @returns 
   */
  attendToEvent(event: string): Observable<Participant> {
    return this.http.post<Participant>(`${ this.apiUrl }api/participants/attend`, {event});
  }

  /**
   * Not attend to an Event/Party
   * @param event 
   * @returns 
   */
  notAttendToEvent(event: string): Observable<Participant> {
    return this.http.post<Participant>(`${ this.apiUrl }api/participants/not-attend`, {event});
  }

  /**
   * List Participants by Event
   * @param event 
   * @returns 
   */
  listParticipantsByEvent(event: Event): Observable<{total: number, participants: Participant[]}> {
    return this.http.get<{total: number, participants: Participant[]}>(`${ this.apiUrl }api/participants/${ event._id }`);
  }

}
