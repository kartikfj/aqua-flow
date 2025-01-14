import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../model/Project';
import { Store } from '@ngrx/store';
import { selectAllProjects } from '../state/selector';
import * as ProjectActions from '../state/action';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-saved-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-project.component.html',
  styleUrl: './saved-project.component.css'
})
export class SavedProjectComponent {
  constructor(private router:Router){}
  projects: Project[] = [
    {
      id: 1,
      projectName: 'High-Rise Water Pump System',
      projectCode: 'HRWPS001',
      contractor: 'Skyline Builders',
      consultant: 'Elite Consultants',
      location: 'Downtown City',
      children: [
        {
          projectId: 1,
          flow: '600 L/min',
          head: '60m',
          pumpSeries: 'HSX',
          pumpModel: 'HSX100',
          pumpSize: '6 inch',
          application: 'Building Supply',
          configuration: 'Vertical',
          quantity: 3,
          strainer: 'Metal',
          flexibleConnector: 'Rubber',
          floatSwitch: 'Automatic',
          floatSwitchQty: 3,
          pressureVessel: 'PV300',
          pressureVesselBrand: 'HydroFlow',
          pressureVesselCapacity: '300L',
          pressureVesselRating: '12 bar',
          material: 'Steel',
          materialQty: 2,
          controlPanelType: 'Digital',
          controlPanelPower: '7kW',
          controlPanelRelay: 'Relay300',
          controlPanelADDC: '24V',
          controlPanelTH: '75°C',
          controlPanelPTC: 'Enabled',
          controlPanelAV: '230V',
          controlPanelBYP: 'Enabled',
        },
        {
          projectId: 1,
          flow: '800 L/min',
          head: '80m',
          pumpSeries: 'HSY',
          pumpModel: 'HSY200',
          pumpSize: '8 inch',
          application: 'Commercial Use',
          configuration: 'Horizontal',
          quantity: 2,
          strainer: 'Plastic',
          flexibleConnector: 'Steel',
          floatSwitch: 'Manual',
          floatSwitchQty: 2,
          pressureVessel: 'PV500',
          pressureVesselBrand: 'AquaTech',
          pressureVesselCapacity: '500L',
          pressureVesselRating: '16 bar',
          material: 'Aluminum',
          materialQty: 4,
          controlPanelType: 'Analog',
          controlPanelPower: '10kW',
          controlPanelRelay: 'Relay500',
          controlPanelADDC: '12V',
          controlPanelTH: '80°C',
          controlPanelPTC: 'Disabled',
          controlPanelAV: '220V',
          controlPanelBYP: 'Disabled',
        },
      ],
    },
    {
      id: 2,
      projectName: 'Agriculture Pump System',
      projectCode: 'AGPS002',
      contractor: 'Farmers Group',
      consultant: 'AgriConsult',
      location: 'Green Valley',
      children: [
        {
          projectId: 2,
          flow: '1000 L/min',
          head: '40m',
          pumpSeries: 'AgriFlow',
          pumpModel: 'AF100',
          pumpSize: '10 inch',
          application: 'Irrigation',
          configuration: 'Vertical',
          quantity: 5,
          strainer: 'Steel',
          flexibleConnector: 'Rubber',
          floatSwitch: 'Automatic',
          floatSwitchQty: 5,
          pressureVessel: 'PV800',
          pressureVesselBrand: 'FarmTech',
          pressureVesselCapacity: '800L',
          pressureVesselRating: '20 bar',
          material: 'Steel',
          materialQty: 3,
          controlPanelType: 'Digital',
          controlPanelPower: '15kW',
          controlPanelRelay: 'Relay800',
          controlPanelADDC: '48V',
          controlPanelTH: '85°C',
          controlPanelPTC: 'Enabled',
          controlPanelAV: '240V',
          controlPanelBYP: 'Enabled',
        },
      ],
    },
  ];
 

  navigateToAddChild(projectId: number) {
    this.router.navigate(['/add-child', projectId]);
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
