import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SavedProjectComponent } from './saved-project/saved-project.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CreateProjectComponent,SavedProjectComponent,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'aqua-select';
  newPage=false;
  constructor(private router: Router) { }

  navigateToCreateProject(): void {
    this.newPage=true;
    this.router.navigate(['/create-project']);
  }

  navigateToSavedProjects(): void {
    this.newPage=true;
    this.router.navigate(['/saved-projects']);
  }
}
