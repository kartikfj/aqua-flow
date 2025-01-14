import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectChild } from './model/Project';


@Injectable({ providedIn: 'root' })
export class ProjectService {
 
  private apiUrl = '/api/projects'; // Adjust the URL to your backend API

  constructor(private http: HttpClient) {}

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
    return this.http.post<ProjectChild>(this.apiUrl,projectChild);
  }
}
