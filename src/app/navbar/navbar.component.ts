import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }


  collapseNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      navbar.classList.remove('show'); // Hide the collapsed navbar on button click
    }
  }

  navigateToCreateProject(): void {
  //  this.newPage=true;
    this.collapseNavbar();
    this.router.navigate(['/create-project']);
  }

  navigateToSavedProjects(): void {
//    this.newPage=true;
    this.collapseNavbar()
    this.router.navigate(['/saved-projects']);
  }
  navigateToHomePage(): void {
  //  this.newPage=false;
    this.collapseNavbar();
    this.router.navigate(['/']);
  }
  navigateToFjPortal(): void {

  //  this.newPage=false;
    window.location.href = 'https://portal.fjtco.com:8444/fjhr/homepage.jsp';
  }
  navigateToHelp(): void {
     this.collapseNavbar()
    //  this.newPage=true;
      this.router.navigate(['/helps']);
    }
}
