import { Component } from '@angular/core';

@Component({
  selector: 'app-helps',
  standalone: true,
  imports: [],
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.css'
})
export class HelpsComponent {
  downloadPDF() {
    const fileUrl = 'assets/manual2.pdf';  // Path to the PDF in the assets folder
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'document.pdf';  // You can change the filename here
    link.click();
  }
}
