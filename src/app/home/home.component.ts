import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  userId: string | null = null;
  ngOnInit(){
    this.userId = this.route.snapshot.paramMap.get('empId');

    if (this.userId) {
      console.log(this.userId);
      // Fetch user details from API
    this.storeUserId(this.userId);}
    // }else{
    //   document.getElementById('openValidationModal1')?.click();
    //   this.navigateToFjPortal();

    //   alert('Error Login in Fj Portal!');
    //   return;
    // }
  }
constructor(private router: Router,private route:ActivatedRoute) { }
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
