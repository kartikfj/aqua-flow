import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AquagetService {

 private baseUrl = 'http//localhost:8080/api';
  constructor(private http: HttpClient) {}

  /**
   * Create a new project.
   * @param projectData Object containing project details.
   * @returns Observable with the server response.
   */
  getContractor(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  /**
   * Save package details associated with a project.
   * @param packageData Object containing package details.
   * @returns Observable with the server response.
   */
  getPumpSeries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/packages`);
  }
  getPumpSize(pumpSeries:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/pumpSeries?${pumpSeries}`);
  }
  getPumpModel(pumpSize:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/pumpModel?${pumpSize}`);
  }
 
  /**
   * Save add-ons details associated with a project.
   * @param getAddonsData Object containing add-ons details.
   * @returns Observable with the server response.
   */
  saveAddons(addonsData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addons`, addonsData);
  }
}
