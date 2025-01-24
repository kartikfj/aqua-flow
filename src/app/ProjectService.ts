import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Project, ProjectChild } from './model/Project';
import { AquagetService } from './aquaget.service';


@Injectable({ providedIn: 'root' })
export class ProjectService {
 
  private apiUrl = '/AquaFlowController'; // Adjust the URL to your backend API

  constructor(private http: HttpClient,private aquaGet:AquagetService) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  saveProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getProjectChildData(projectId: number): Observable<ProjectChild[]> {
    return this.http.get<ProjectChild[]>(`${this.apiUrl}/${projectId}/children`);
  }

  saveChildProject(projectChild: ProjectChild): Observable<ProjectChild> {
     const empId=this.aquaGet.getUserId();
        if (empId) {
         // const apiUrl = `/AquaFlowController?action=saveProject&empId=${empId}`;
          return this.http.post<ProjectChild>(`${this.apiUrl}?action=saveProduct&empId=${empId}`,projectChild);
         
        } else {
          console.error('Error: Employee ID is missing.');
          return throwError(() => new Error('Employee ID is required to create a project.'));
        } 
  }
  
}
