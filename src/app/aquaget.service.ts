import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AquagetService {

// private baseUrl = 'http//localhost:8080/api';
 apiUrl="/AquaFlowController";
  constructor(private http: HttpClient) {}

  /**
   * Create a new project.
   * @param projectData Object containing project details.
   * @returns Observable with the server response.
   */
  getContractor(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects`);
  }

  /**
   * Save package details associated with a project.
   * @param packageData Object containing package details.
   * @returns Observable with the server response.
   */
 // http://localhost:8080/FJPORTAL_DEV/AquaFlowController?def
  getPumpSeries(): Observable<string[]> {
  
    return this.http.get<string[]>(`${this.apiUrl}?def`);
  }
  getPumpSize(pumpSeries:string):Observable<string[]>{
    console.log("data 2 come");
    return this.http.get<string[]>(`${this.apiUrl}?action=pumpSize&pumpSeries=${pumpSeries}`);
  }
  getPumpModel(pumpSize:string):Observable<any>{
    return this.http.get<string[]>(`${this.apiUrl}?action=pumpModel&pumpSize=${pumpSize}`);
  }
  getProjectModelData():Observable<any>{
    return this.http.get(`${this.apiUrl}?action=retrieveProject`);
  }
  getProjectContractor():Observable<any>{
    return this.http.get(`${this.apiUrl}?action=getProjectDetails`);
  }
  getProjectQuery(query:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}?action=searchProjects&query=${query}`);
  }
  getProjectData():Observable<any>{
    return this.http.get(`${this.apiUrl}?action=retrieveProjectAllData`);
  }
  getProjectById(projectId:number):Observable<any>{
    return this.http.get(`${this.apiUrl}?action=retrieveProjectById&&projectId=${projectId}`);
  }
  getSavedProjectById(projectId:number):Observable<any>{
    return this.http.get(`${this.apiUrl}?action=getSavedProjectDetails&&project=${projectId}`);
    console.log
  }
  //http://localhost:8080/FJPORTAL_DEV/AquaFlowController?action=getSavedProjectDetails&&project=41
  /**
   * Save add-ons details associated with a project.
   * @param getAddonsData Object containing add-ons details.
   * @returns Observable with the server response.
   */
  // saveAddons(addonsData: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/addons`, addonsData);
  // }
}
