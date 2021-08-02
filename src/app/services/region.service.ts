import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get all the regions
   * @returns 
   */
  getRegions(): Observable<{total: number, regions: Region[]}> {
    return this.http.get<{total: number, regions: Region[]}>(`${ this.apiUrl }api/regions`);
  }
}
