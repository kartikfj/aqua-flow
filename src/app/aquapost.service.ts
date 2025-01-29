import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AquagetService } from './aquaget.service';

@Injectable({
  providedIn: 'root'
})
export class AquapostService {
  private baseUrl = 'http//localhost:8080/FJPORTAL_DEV/AquaFlowController';
  constructor(private http: HttpClient,private aquaget:AquagetService) {}

  /**
   * Create a new project.
   * @param projectData Object containing project details.
   * @returns Observable with the server response.
   */
  createProject(projectData: any): Observable<any> {
    console.log('save');
    const empId=this.aquaget.getUserId();
    if (empId) {
      const apiUrl = `/AquaFlowController?action=saveProject&empId=${empId}`;
      return this.http.post(apiUrl, projectData);
    } else {
      console.error('Error: Employee ID is missing.');
      return throwError(() => new Error('Employee ID is required to create a project.'));
    }
    
  }
  saveRevision(projectData: any): Observable<any> {
    console.log('save');
    const empId=this.aquaget.getUserId();
    if (empId) {
      const apiUrl = `/AquaFlowController?action=saveRevision&empId=${empId}`;
      return this.http.post(apiUrl, projectData);
    } else {
      console.error('Error: Employee ID is missing.');
      return throwError(() => new Error('Employee ID is required to create a project.'));
    }
    
  }
  /**
   * Save package details associated with a project.
   * @param packageData Object containing package details.
   * @returns Observable with the server response.
   */
  // savePackage(packageData: any): Observable<any> {
  //   const apiUrl = '/AquaFlowController?action=saveProduct';
  //   return this.http.post(apiUrl,packageData);
  // }

  /**
   * Save add-ons details associated with a project.
   * @param addonsData Object containing add-ons details.
   * @returns Observable with the server response.
   */
  saveAddons(addonsData: any): Observable<any> {

    return this.http.post(`${this.baseUrl}/addons`, addonsData);
  }

}
