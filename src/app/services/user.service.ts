import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/userProfile.model';

interface RegisterResponse {
  user: User,
  token: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Call register API to create user
   * @param user 
   * @returns 
   */
  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${ this.apiUrl }api/users`, user);
  }

  /**
   * Get User Profile Data
   * @returns 
   */
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${ this.apiUrl }api/users/profile`);
  }



}
