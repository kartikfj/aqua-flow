import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AquapostService {
  private baseUrl = 'http//localhost:8080/FJPORTAL_DEV/AquaFlowController';
  constructor(private http: HttpClient) {}

  /**
   * Create a new project.
   * @param projectData Object containing project details.
   * @returns Observable with the server response.
   */
  createProject(projectData: any): Observable<any> {
    console.log('save');
    const apiUrl = '/AquaFlowController?action=saveProject';
    return this.http.post(apiUrl, projectData);
  }

  /**
   * Save package details associated with a project.
   * @param packageData Object containing package details.
   * @returns Observable with the server response.
   */
  savePackage(packageData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/packages`, packageData);
  }

  /**
   * Save add-ons details associated with a project.
   * @param addonsData Object containing add-ons details.
   * @returns Observable with the server response.
   */
  saveAddons(addonsData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addons`, addonsData);
  }

}
