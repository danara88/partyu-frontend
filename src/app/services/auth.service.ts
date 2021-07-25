import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
  

  changePassword(user: any): Observable<User> {
    return this.http.post<User>(`${ this.apiUrl }api/users/change-password`, user);
  }

  

}
