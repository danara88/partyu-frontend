import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/userProfile.model';

interface LoginResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl: string = environment.apiUrl;
  public identity: UserProfile | null = new UserProfile('','');

  constructor(private http: HttpClient) { }

  /**
   * Get user identity
   * @returns 
   */
  getIdentity(): UserProfile | null {
    let identity: UserProfile = JSON.parse(localStorage.getItem('identity')!);
    this.identity = null;
    if (identity !== undefined) this.identity = identity;

    return this.identity;
  }

  /**
   * Call login API to authenticate user
   * @param user 
   * @returns 
   */
  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${ this.apiUrl }api/auth/login`, user);
  }

  /**
   * Send recover password to email inbox user
   * @param email 
   * @returns 
   */
  recoverPassword(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${ this.apiUrl }api/users/recovery-password`, { email });
  }
  
  /**
   * Change the user password
   * @param user 
   * @returns 
   */
  changePassword(user: any): Observable<User> {
    return this.http.post<User>(`${ this.apiUrl }api/users/change-password`, user);
  }

  

}
