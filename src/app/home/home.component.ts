import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private router: Router) { }
   newPage=false;
  navigateToCreateProject(): void {
    this.newPage=true;
    this.router.navigate(['/create-project']);
  }

  navigateToSavedProjects(): void {
    this.newPage=true;
    this.router.navigate(['/saved-projects']);
  }
}
