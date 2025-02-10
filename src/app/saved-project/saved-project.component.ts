import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectChild } from '../model/Project';
import { Store } from '@ngrx/store';
import { selectAllProjects } from '../state/selector';
import * as ProjectActions from '../state/action';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AquagetService } from '../aquaget.service';
import * as XLSX from 'xlsx';
import logoData from '../create-project/logo.json'; // Import JSON file

@Component({
  selector: 'app-saved-project',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './saved-project.component.html',
  styleUrl: './saved-project.component.css'
})
export class SavedProjectComponent {


  constructor(private router: Router,private aquaGetService:AquagetService) {}
  ngOnInit(): void {
    // Initialize all forms
    // this.route.params.subscribe((params)=>{
    //   this.projectId =+params['projectId'];
    //  // this.fetchProjectDetails();
    //  this.getPumSeries();
    // })
    this.logoUrl = logoData.logo;
    this.getAllProject();
//this.getProjectModelData();
  }
  projects:Project[]=[];
  filteredProjects:Project[]=[];
  projectsChild:ProjectChild[]=[];
  rivison:number[]=[];
  projectCode:string='';
  projectName:string='';
  generatedCode:string='';
  riv:number=0;
  grandTotal:number=0;

  logoUrl: string = '';
  contractor:string='';
  location:string='';
  consultant:string='';
  searchValues = {
    projectCode: '',
    portalGneratedCode:'',
    projectName: '',
    contractor: '',
    consultant:'',
    location:''
  };

 // filteredProjects = [...this.projects];
  searchQuery = '';
  expandedRowIndex: number | null = null;
  expandNumber: number | null = null;
  // Filter projects based on search query
  filterProjects() {
    this.filteredProjects = this.projects.filter((project) =>
      project.projectName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(this.filterProjects);
  }
  applyFilter() {
    this.filteredProjects = this.projects.filter(user =>
      user.projectCode.toLowerCase().includes(this.searchValues.projectCode) &&
      user.generatedCode.toLowerCase().includes(this.searchValues.portalGneratedCode) &&
     
      user.projectName.toLowerCase().includes(this.searchValues.projectName.toLowerCase()) &&
      user.consultant.toLowerCase().includes(this.searchValues.consultant.toLowerCase()) &&
      user.contractor.toLowerCase().includes(this.searchValues.contractor.toLowerCase()) &&
      user.location.toLowerCase().includes(this.searchValues.location.toLowerCase())
    );
      // 🔥 Reset to full table if all search inputs are empty
  if (Object.values(this.searchValues).every(value => value.trim() === '')) {
    this.filteredProjects = [...this.projects];
  }
  }
  // Sort projects based on column
  sortData(column: keyof Project) {
    this.filteredProjects.sort((a, b) => {
      const valueA = (a[column] ?? '').toString().toLowerCase();
      const valueB = (b[column] ?? '').toString().toLowerCase();
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }
  sortChildData(column: keyof Project) {
    this.filteredProjects.sort((a, b) => {
      const valueA = (a[column] ?? '').toString().toLowerCase();
      const valueB = (b[column] ?? '').toString().toLowerCase();
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }
  
  // Toggle child row visibility
  toggleChildData(index: number) {
    console.log(index)
     this.expandNumber=index;
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  // Navigate to add child
  navigateToAddChild(projectId: number) {
    this.router.navigate(['/add-child', projectId]);
  }

  // getAllProject(){
  //   this.aquaGetService.getProjectData().subscribe(
  //     (data)=>{
      
  //        this.projects=data;
  //        this.filterProjects();
  //        console.log(this.projects);
  //      // this.projects.push(data);
  //       console.log(data);
  //     }
  //   )
  // }
  getAllProject(){
    this.aquaGetService.getProjectModelData().subscribe(
      (data)=>{
      
         this.projects=data;
         this.filterProjects();
         console.log(this.projects);
       // this.projects.push(data);
        console.log(data);
      }
    )
  }
  
  childDataShow(projectId: number):void {
    console.log(projectId);
    if(projectId!=null){
    this.projects.filter(childData=>{
       if(childData.id==projectId){
        this.projectCode=childData.projectCode;
        this.projectName=childData.projectName;
        this.generatedCode=childData.generatedCode;
        this.riv=childData.revision;
        this.contractor=childData.contractor;
        this.location=childData.location;
        this.consultant=childData.consultant;
        document.getElementById('openValidationModal')?.click();
        this.projectsChild=childData.children;
        this.calculateGrandTotal();
       }
    })
  }
  
}
calculateGrandTotal() {
  this.grandTotal = this.projectsChild.reduce((sum, child) => sum + (child.TOTALCOST || 0), 0);
}

// printModalData() {
//   const printContent = document.getElementById('modalContentToPrint');

//   // Remove the "Print" and "Close" buttons before printing
//   const buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLElement>;;
//   buttons.forEach(button => button.style.display = 'none');  // Hide buttons

//   // Open the print window and write the content
//   const WindowPrt = window.open('', '', 'width=900,height=700');
//   WindowPrt?.document.write('<html><head><title>Project Summary</title>');
//   WindowPrt?.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: center;} th {background-color: #f2f2f2;}</style>'); // Added table styling for lines
//   WindowPrt?.document.write('</head><body>');
//   WindowPrt?.document.write(printContent?.outerHTML || '');
//   WindowPrt?.document.write('</body></html>');
//   WindowPrt?.document.close();
//   WindowPrt?.focus();
  
//   // Print the content
//   WindowPrt?.print();
  
//   // Close the window after printing
//   WindowPrt?.close();

//   // Re-show the buttons after printing
//   buttons.forEach(button => button.style.display = 'inline-block');
// }


printModalData() {
  const printContent = document.getElementById('modalContentToPrint');

  // Hide all buttons before printing
  const buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLElement>;
  buttons.forEach(button => button.style.display = 'none');

  // Get the current date
  const currentDate = new Date().toLocaleDateString();
  const logoUrl = this.logoUrl;

  // Open a new print window
  const WindowPrt = window.open('', '', 'width=900,height=700');

  WindowPrt?.document.write(`
    <html>
      <head>
        <title>-</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .logo { flex: 0 0 140px; } /* Logo fixed size */
          .logo img { max-width: 140px; height: auto; } 
          .title { font-size: 30px; font-weight: bold; wrap:word-break; text-align: center; width: 100%; }
          .date { font-size: 24px; font-weight: bold; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 10px; text-align: center; font-size: 16px; }
          th { background-color: #f2f2f2; font-size: 18px; }
          td:nth-child(n+2) { text-align: right; } /* Align numbers to the right */
          h4 { font-size: 20px; margin: 10px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
         <div class="logo">
           <img src="${logoUrl}" alt="Aqua-select Logo" onerror="this.onerror=null; this.src='https://via.placeholder.com/150?text=No+Image'" />

          </div>
          <div class="title" style="color:#103d63";>Selection Summary</div>
          <div class="date" style="color:#103d63";>Date: ${currentDate}</div>
        </div>
        ${printContent?.outerHTML || ''}
      </body>
    </html>
  `);

  WindowPrt?.document.close();
  WindowPrt?.focus();
  
  // Print and close the window
  WindowPrt?.print();
  WindowPrt?.close();

  // Show the buttons again after printing
  buttons.forEach(button => button.style.display = 'inline-block');
}

exportToExcel() {
  let exportData: any[] = [];
  
  this.projects.forEach(project => {
    exportData.push({
      "Project Code": project.projectCode,
      "Generated Code": project.generatedCode+'/R'+project.revision,
      "Project Name": project.projectName,
      "Contractor": project.contractor,
      "Consultant": project.consultant,
      "Location": project.location,
      
    });
    project.children.forEach(child => {
      exportData.push({
        "Project Code": '',
        "Generated Code": '',
        "Project Name": '',
        "Contractor": '',
        "Consultant": '',
        "Location": '',
        "Flow": child.flow,
        "Head": child.head,
        "Quantity": child.quantity,
        "TotalCost":child.TOTALCOST,
        "Pump Series": child.pumpSeries,
        "Pump Model": child.pumpModel,
        "Pump Size": child.pumpSize,
        "Application": child.application,
        "Configuration": child.configuration,
        
        "Strainer": child.strainer
      });
    });
  });
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  XLSX.writeFile(workbook, 'ProjectReport.xlsx');
}







  // projects$: Observable<Project[]>;

  // constructor(private store: Store) {
  //   this.projects$ = this.store.select(selectAllProjects);
  // }

  // ngOnInit() {
  //   this.store.dispatch(ProjectActions.fetchProject());
  // }

  // saveProject(project: Project) {
  //   this.store.dispatch(ProjectActions.saveProject({ project }));
  // }

  // fetchChildData(projectId: number) {
  //   this.store.dispatch(ProjectActions.fetchProjectChildData({ projectId }));
  // }
}



// projects = [
  //   {
  //     id: 1,
  //     projectName: 'Project A',
  //     projectCode: 'PA001',
  //     location: 'Location A',
  //     contractor: 'Contractor A',
  //     consultant: 'Consultant A',
  //     children: [
  //       {
  //         pumpSeries: 'Series 1',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series 2',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series 3',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     projectName: 'Project c',
  //     projectCode: 'PA001',
  //     location: 'Location c',
  //     contractor: 'Contractor c',
  //     consultant: 'Consultant c',
  //     children: [
  //       {
  //         pumpSeries: 'Series 1',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series 2',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series 3',
  //         pumpModel: 'Model A1',
  //         flow: '100 LPM',
  //         head: '50 m',
  //         pumpSize: '2 inch',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     projectName: 'Project B',
  //     projectCode: 'PB002',
  //     location: 'Location B',
  //     contractor: 'Contractor B',
  //     consultant: 'Consultant B',
  //     children: [
  //       {
  //         pumpSeries: 'Series B',
  //         pumpModel: 'Model B1',
  //         flow: '200 LPM',
  //         head: '30 m',
  //         pumpSize: '2 inches',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series B1',
  //         pumpModel: 'Model B1',
  //         flow: '200 LPM',
  //         head: '30 m',
  //         pumpSize: '2 inches',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //       {
  //         pumpSeries: 'Series B2',
  //         pumpModel: 'Model B1',
  //         flow: '200 LPM',
  //         head: '30 m',
  //         pumpSize: '2 inches',
  //         application: 'Industrial',
  //         configuration: 'Vertical',
  //         quantity: 2,
  //       },
  //     ],
  //   },
  // ];