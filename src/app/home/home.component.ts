import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AquagetService } from '../aquaget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  userId: string | null = null;
  empCode: string | null=null;


  ngOnInit(){
   this.userId = this.route.snapshot.paramMap.get('empId');
   const empId=this.aquaget.getUserId();
  //this.userId= sessionStorage.getItem("emp_code");

    if (this.userId) {
      console.log(this.userId);
      this.empCode = atob(this.userId);
      console.log(this.empCode);
      // Fetch user details from API
    this.storeUserId(this.empCode);
  // }else{
  //   this.storeUserId("E004885");
  // }
    }
    if (this.empCode || empId) {
      // If at least one exists, navigate to home
      this.router.navigate(['/home']);
    } else {
      // If neither exists, show validation modal and navigate to Fj Portal
      document.getElementById('openValidationModal1')?.click();
      this.navigateToFjPortal();
      alert('Error Logging in Fj Portal!');
    } 
  }
  
constructor(private router: Router,private route:ActivatedRoute,private aquaget:AquagetService) { }
   newPage=false;
  navigateToCreateProject(): void {
    this.newPage=true;
    this.router.navigate(['/create-project']);
  }

  navigateToSavedProjects(): void {
    this.newPage=true;
    this.router.navigate(['/saved-projects']);
  }
  storeUserId(userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Set expiry to 30 days from now
  
    const userData = { id: userId, expiry: expiryDate.getTime() };
    localStorage.setItem('userId', JSON.stringify(userData));
  }
  navigateToFjPortal(): void {
    this.newPage=false;
    window.location.href = 'https://portal.fjtco.com:8444/fjhr/homepage.jsp';
  }
}
