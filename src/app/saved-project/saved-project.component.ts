import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../model/Project';
import { Store } from '@ngrx/store';
import { selectAllProjects } from '../state/selector';
import * as ProjectActions from '../state/action';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AquagetService } from '../aquaget.service';
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
    this.getAllProject();

  }
  projects:Project[]=[];
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

  filteredProjects = [...this.projects];
  searchQuery = '';
  expandedRowIndex: number | null = null;

  // Filter projects based on search query
  filterProjects() {
    this.filteredProjects = this.projects.filter((project) =>
      project.projectName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  // Navigate to add child
  navigateToAddChild(projectId: number) {
    this.router.navigate(['/add-child', projectId]);
  }

  getAllProject(){
    this.aquaGetService.getProjectData().subscribe(
      (data)=>{
         this.projects=data;
       // this.projects.push(data);
        console.log(data);
      }
    )
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
