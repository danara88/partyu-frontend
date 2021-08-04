import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invitation } from '../models/invitation.model';


@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Meke invitations to the users
   * @param invitation 
   * @returns 
   */
  inviteUser(invitation: {user: string, event: string}): Observable<Invitation> {
    return this.http.post<Invitation>(`${ this.apiUrl }api/invitations`, invitation);
  }

  /**
   * Get all the invitations
   * @returns 
   */
  getMyInvitations(limit: number = 5): Observable<{total: number, invitations: Invitation[]}> {
    return this.http.get<{total: number, invitations: Invitation[]}>(`${ this.apiUrl }api/invitations?limit=${ limit }`);
  }

}
