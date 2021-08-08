import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';
import { Participant } from '../models/participant';
import { EventCalendar } from '../models/eventCalendar.model';

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
   * Gets all the participantions by the user
   * @returns 
   */
  getMyEventsParticipation(eventsFormat: boolean = false): Observable<Participant[] | Event[]> {
    if (eventsFormat) {
      return this.http.get<Event[]>(`${ this.apiUrl }api/events/my-events-participations?eventsformat=true`);
    }
    return this.http.get<Participant[]>(`${ this.apiUrl }api/events/my-events-participations`);
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
