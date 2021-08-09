import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';
import { Participant } from '../models/participant';
import { EventCalendar } from '../models/eventCalendar.model';
import { Invitation } from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get All the Events in General
   * @returns 
   */
  getEvents(): Observable<{total: number, events: Event[]}> {
    return this.http.get<{total: number, events: Event[]}>(`${ this.apiUrl }api/events`);
  }

  /**
   * Create an event
   * @param event 
   * @returns 
   */
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${ this.apiUrl }api/events`, event);
  }

  /**
   * Update an event
   * @param event 
   * @returns 
   */
  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${ this.apiUrl }api/events/${ event._id }`, event);
  }

  /**
   * Get all the public events by the user
   * @returns 
   */
  getPublicEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${ this.apiUrl }api/events/public/list`);
  }

  /**
   * Get all accepted and private inviations/events by the user
   * @param eventsFormat 
   * @returns 
   */
  getPrivateEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${ this.apiUrl }api/events/private/list`);
  }

  /**
   * Gets all the participantions by the user
   * @returns 
   */
  getMyEventCalendar(): Observable<EventCalendar[]> {
    return this.http.get<EventCalendar[]>(`${ this.apiUrl }api/events/my-events-calendar`);
  }

  /**
   * Delete an Event
   * @param event 
   * @returns 
   */
  deleteEvent(event: Event): Observable<Event> {
    return this.http.delete<Event>(`${ this.apiUrl }api/events/${ event._id }`);
  }

}
