import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SavedProjectComponent } from './saved-project/saved-project.component';
import { NgIf } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from "./footer/footer.component";
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CreateProjectComponent, SavedProjectComponent, 
    NgIf, FooterComponent,FooterComponent,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'aqua-select';
  newPage=false;
  constructor(private router: Router,private loaderService: LoaderService) { }
  ngOnInit(): void {
    this. testLoader();
    // Optionally, trigger loader manually for a few seconds.
  }
  navigateToCreateProject(): void {
    this.newPage=true;
    this.router.navigate(['/create-project']);
  }

  navigateToSavedProjects(): void {
    this.newPage=true;
    this.router.navigate(['/saved-projects']);
  }
  navigateToHomePage(): void {
    this.newPage=false;
    this.router.navigate(['/']);
  }
  navigateToFjPortal(): void {
    this.newPage=false;
    window.location.href = 'https://portal.fjtco.com:8444/fjhr/homepage.jsp';
  }
  testLoader() {
    this.loaderService.show();
    setTimeout(() => {
      this.loaderService.hide();
    }, 3000);
  }
}
