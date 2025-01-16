import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AquapostService } from '../aquapost.service';
import { AquagetService } from '../aquaget.service';
import { Project, ProjectChild, ProjectData } from '../model/Project';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllChildProjects, selectAllProjects } from '../state/selector';
import * as ProjectActions from '../state/action';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'], // Fixed typo (styleUrl -> styleUrls)
})
export class CreateProjectComponent {
  projectForm!: FormGroup;
  packageForm!: FormGroup;
  // addonsForm!: FormGroup;
  // pressureVessleForm!: FormGroup;
  // controllPanelForm!: FormGroup;

  pumpSeriesOptions:string[] = [];
  selectedPumpSeries: string = '';
  selectedModelSeries: string = '';
  pumpSizeOptions:string[]=[];
  pumpModelOption:string[]=[];
  applicationOptions = ['BOOSTER', 'TRANSFER', 'CIRCULATION','PRESSURIZATION'];
  configurationOptions = ['DUPLEX', 'TRIPLEX'];
  strainerOptions = ['No Strainer', 'Strainer for Header','Strainer for Pump'];
  flexibleOptions = ['No Flexible Connector', 'Flexible Connector on Header (FCH)','Flexible Connector for Pump (FCP)'];
  floatOptions = ['Yes', 'No'];
  pressureVessel=['Yes','No'];
  brand=['Reflex','Feflex'];
  capacity=['60L','50L','40L'];
  pressureRating=['PN 10','PN 9','PN 8'];
  material=['Butyl'];
  type=['DOL','FOL','MOL'];
  power=['One','Two'];

  projects$: Observable<ProjectChild[]>;
  //projectId: string | null = null; // Stores the project ID from the backend
  projectId!: number;
  project:ProjectData[]=[]
  isLastState = true;
  disabledButton=false;
  currentStep = 1;
  totalSteps = 5;
  currentState: 'project' | 'package' | 'addons' | 'pressureVessel' | 'controllPanel' = 'project';
  isModalOpen = false;
  isDropdownOpen = false;
  constructor(private store: Store,private fb: FormBuilder, private http: HttpClient,private aquaPost:AquapostService,private aquaGet:AquagetService,private route: ActivatedRoute) {
    this.projects$ = this.store.select(selectAllChildProjects);
  }
  projects:Project[]=[];
  //projects : any[]=[];
 // Will store the filtered and limited list of projects
 filteredProjects = [...this.project];
 toggleDropdown(state: boolean): void {
  this.isDropdownOpen = state;
}

// Closes the dropdown with a slight delay to allow selection
closeDropdownWithDelay(): void {
  setTimeout(() => {
    this.isDropdownOpen = false;
  }, 200); // Adjust delay as needed
}

// Handles project selection
ngAfterOnInit(){
  this.getAllProjectById()
if(this.projectId){
  this.disabledButton=true;
}
}
  ngOnInit(): void {
    this.getAllProjectContractor();
    // Initialize all forms
    this.route.params.subscribe((params)=>{
      this.projectId =+params['projectId'];
     // this.fetchProjectDetails();
     this.getPumSeries();
     if(this.project){
      this.getAllProjectById();
     }
    })
    if(this.projectId){
      this.currentStep = 2;
      this.currentState='package'
    }
    this.projectForm = this.fb.group({

      projectName: [''],
      projectCode:[''],
      contractor: [''],
      consultant: [''],
      location: [''],
    });

    this.packageForm = this.fb.group({
      flow: [''],
      head: [''],
      pumpSeries: [''],
      pumpModel:[''],
      pumpSize: [''],
      application: [''],
      configuration: [''],
      quantity: [0],
    //});

    //this.addonsForm = this.fb.group({
      strainer: [''],
      flexibleConnector: [''],
      floatSwitch: [''],
      floatSwitchQty: [''],
    //});

   // this.pressureVessleForm = this.fb.group({
      pressureVessel: [''],
      pressureVesselBrand:[''],
      pressureVesselCapacity:[''],
      pressureVesselRating:[''],
      material:[''],
      materialQty:[''],
    //});

   // this.controllPanelForm=this.fb.group({
    controlPanelType:[''],
    controlPanelPower:[''],
    controlPanelRelay:[''],
    controlPanelADDC:[''],
    controlPanelTH:[''],
    controlPanelPTC:[''],
    controlPanelAV:[''],
    controlPanelBYP:['']
    });
  }

  searchProjects(event:Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (query) {
      this.filteredProjects = this.project.filter(project =>
        project.projectName.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 4);  // Limit the results to 3 projects
    } else {
      this.filteredProjects = [];  // If query is empty, show no suggestions
    }
  }

  // Function to set project details in the form when a project is selected
  selectProject(project: any) {
    this.projectForm.patchValue({
      projectName: project.projectName,
      projectCode: project.projectCode,
      contractor: project.contractor,
      consultant: project.consultant,
      location: project.location
    });
    this.isDropdownOpen = false;
    this.filteredProjects = []; 
  }
  saveProject() {
    if (this.currentState === 'project') {
      const projectData = this.projectForm.value;
      //this.projectId = "1";
      console.log(projectData);
      this.aquaPost.createProject(projectData).subscribe(
        (response:any)=>{ console.log(response);
          this.projectId=response.updateStatus;
          this.disabledButton=true;
          alert(`Project Saved Successfully!,${this.projectId}`);

        },
        (error)=>{
          alert('Error Saving Project!');
        }
      )

    //   this.http.post('/api/projects', projectData).subscribe(
    //     (response: any) => {
    //       this.projectId = response.id; // Save project ID for child data
    //       alert('Project saved successfully!');
    //     },
    //     (error) => {
    //       alert('Error saving project. Please try again.');
    //       console.error(error);
    //     }
    //   );
    // }
  }
}
//parentSysId:String = '1';
  savePackage() {
  // this.projectId=33;
    if (!this.projectId) {
      alert('Please create a project first!');
      return;
    }

    const packageData = {
      ...this.packageForm.value,
      parentSysId: this.projectId,
    };
    console.log(packageData);
    this.store.dispatch(ProjectActions.saveProjectChildData({ packageData }));
              console.log("testing");
    
   // this.aquaPost.savePackage(packageData).subscribe(
      //(response)=>{
        alert('package set saved successffully');
        this.getAllProjectById();
        this.packageForm.reset();

        this.currentState="package";
        this.currentStep = 1;
        console.log(this.packageForm);
    //  },
    //  (error)=>{
       // window.alert('Package set saved successfully. Click OK to continue.');
       this.isModalOpen = true; // Set modal open state to true
       this.showToast();
       // Automatically show the Success Modal
       const successModalElement = document.getElementById('successModal');
       if (successModalElement) {
         successModalElement.classList.add('show');
         successModalElement.style.display = 'block';
       }
        this.packageForm.reset();
        this.currentStep=2;
        this.currentState="package";
        console.log(this.packageForm);
        this.currentStep = 1;
       // alert('Error saving package set. Please Try again.')
    //  }
  //  )
    // this.http.post('/api/packages', packageData).subscribe(
    //   () => {
    //     alert('Package set saved successfully!');
    //   },
    //   (error) => {
    //     alert('Error saving package set. Please try again.');
    //     console.error(error);
    //   }
    // );
  }

  saveAddons() {
    if (!this.projectId) {
      alert('Please create a project first!');
      return;
    }

  //   const addonsData = {
  //     ...this.addonsForm.value,
  //     projectId: this.projectId,
  //   };
  //  // console.log(addonsData);
  //    this.aquaPost.saveAddons(addonsData).subscribe(
  //     (response)=>{
  //       alert('Add-ons saved successfully');
  //     },
  //     (error)=>{
  //       alert('Error saving add-one. Please try again');
  //     }
  //    )
  //   // this.http.post('/api/addons', addonsData).subscribe(
  //   //   () => {
  //   //     alert('Add-ons saved successfully!');
  //   //   },
  //   //   (error) => {
  //   //     alert('Error saving add-ons. Please try again.');
  //   //     console.error(error);
  //   //   }
  //   // );
  // }
  // savePressureVessle() {
  //   this.projectId = "1";
  //   if (!this.projectId) {
  //     alert('Please create a project first!');
  //     return;
  //   }

  //   const pressureVessleForm = {
  //     ...this.pressureVessleForm.value,
  //     projectId: this.projectId,
  //   };
  //  console.log(pressureVessleForm);
  //   //  this.aquaPost.saveAddons(addonsData).subscribe(
  //   //   (response)=>{
  //   //     alert('Add-ons saved successfully');
  //   //   },
  //   //   (error)=>{
  //   //     alert('Error saving add-one. Please try again');
  //   //   }
  //   //  )
  //   }
  //   saveControllPanel() {
  //     this.projectId = "1";
  //     if (!this.projectId) {
  //       alert('Please create a project first!');
  //       return;
  //     }
  
  //     const controllPanel = {
  //       ...this.controllPanelForm.value,
  //       projectId: this.projectId,
  //     };
  //    console.log(controllPanel);
  //     //  this.aquaPost.saveAddons(addonsData).subscribe(
  //     //   (response)=>{
  //     //     alert('Add-ons saved successfully');
  //     //   },
  //     //   (error)=>{
  //     //     alert('Error saving add-one. Please try again');
  //     //   }
  //     //  )
  //     }
  }
    addToProject() {
      // Logic to add to the project
      console.log('Added to project!');
    }
    getProgress() {
      return (this.currentStep / this.totalSteps) * 100;
    }
  
    finish() {
      // Logic to finish the process
      console.log('Finished!');
    }
  goNext() {
    if (this.currentState === 'project') {
      this.currentState = 'package';
      this.currentStep++;
      this.isLastState=true;
    } else if (this.currentState === 'package') {
      this.currentState = 'addons';
      this.currentStep++;
      this.isLastState=true;
    }
    else if(this.currentState==='addons'){
      this.currentState = 'pressureVessel';
      this.currentStep++;
      this.isLastState=true;
      
    }else if(this.currentState==='pressureVessel'){
      this.currentState='controllPanel';
      this.currentStep++;
      this.isLastState=false;
    }
  }

  goBack() {
    if (this.currentState === 'addons') {
      this.currentState = 'package';
      this.currentStep--;
      this.isLastState=true;
    } else if (this.currentState === 'package') {
      this.currentState = 'project';
      this.currentStep--;
      this.isLastState=true;
    }else if(this.currentState==='pressureVessel'){
      this.currentState='addons';
      this.currentStep--;
      this.isLastState=true;
    }else if(this.currentState==='controllPanel'){
      this.currentState='pressureVessel';
      this.currentStep--;
      this.isLastState=true;
    }

  }
  confirmToADD() {
    // Perform your delete logic here
    console.log('Resort deleted!');
  }
  showToast() {
    const toastElement = document.getElementById('successToast');
    if (toastElement) {
      // Use the built-in 'show' method via Bootstrap classes
      toastElement.classList.add('show');
    }
  }
  getPumSeries(){
    this.aquaGet.getPumpSeries().subscribe(data=>{
      this.pumpSeriesOptions=data;
      console.log(this.pumpSeriesOptions);
    },
  (error)=>{
      console.log('fetching data we got error',error);
  })
 

  }
  onSelectedPumpSeries(event: any){
    console.log("data came");
     this.selectedPumpSeries=event.target.value;
     if(this.selectedPumpSeries){
      this.aquaGet.getPumpSize(this.selectedPumpSeries).subscribe(data=>{
       this.pumpSizeOptions=data;
        console.log(this.pumpSizeOptions);
      }
      
      ,(error)=>{
        console.log('fetching data',error);
      })
      this.aquaGet.getPumpModel(this.selectedPumpSeries).subscribe(data=>{
        this.pumpModelOption=data;
        console.log(this.pumpModelOption);
      })
     }
     
  }
  onSelectedModelSeries(event: any){
    console.log("data came");
     this.selectedModelSeries=event.target.value;
     if(this.selectedModelSeries){
      this.aquaGet.getPumpModel(this.selectedModelSeries).subscribe(data=>{
        this.pumpModelOption=data;
        console.log(this.pumpModelOption);
      }
      
      ,(error)=>{
        console.log('fetching data',error);
      })
     
}
  }
// Initialize with all projects
//  dummyProjects: Project[] = [
//   {
//     id: 1,
//     projectName: 'High-Rise Water Pump System',
//     projectCode: 'HRWPS001',
//     contractor: 'Skyline Builders',
//     consultant: 'Elite Consultants',
//     location: 'Downtown City',
//     children: [
//       {
//         projectId: 1,
//         flow: '600 L/min',
//         head: '60m',
//         pumpSeries: 'HSX',
//         pumpModel: 'HSX100',
//         pumpSize: '6 inch',
//         application: 'Building Supply',
//         configuration: 'Vertical',
//         quantity: 3,
//         strainer: 'Metal',
//         flexibleConnector: 'Rubber',
//         floatSwitch: 'Automatic',
//         floatSwitchQty: 3,
//         pressureVessel: 'PV300',
//         pressureVesselBrand: 'HydroFlow',
//         pressureVesselCapacity: '300L',
//         pressureVesselRating: '12 bar',
//         material: 'Steel',
//         materialQty: 2,
//         controlPanelType: 'Digital',
//         controlPanelPower: '7kW',
//         controlPanelRelay: 'Relay300',
//         controlPanelADDC: '24V',
//         controlPanelTH: '75°C',
//         controlPanelPTC: 'Enabled',
//         controlPanelAV: '230V',
//         controlPanelBYP: 'Enabled',
//       },
//       {
//         projectId: 1,
//         flow: '800 L/min',
//         head: '80m',
//         pumpSeries: 'HSY',
//         pumpModel: 'HSY200',
//         pumpSize: '8 inch',
//         application: 'Commercial Use',
//         configuration: 'Horizontal',
//         quantity: 2,
//         strainer: 'Plastic',
//         flexibleConnector: 'Steel',
//         floatSwitch: 'Manual',
//         floatSwitchQty: 2,
//         pressureVessel: 'PV500',
//         pressureVesselBrand: 'AquaTech',
//         pressureVesselCapacity: '500L',
//         pressureVesselRating: '16 bar',
//         material: 'Aluminum',
//         materialQty: 4,
//         controlPanelType: 'Analog',
//         controlPanelPower: '10kW',
//         controlPanelRelay: 'Relay500',
//         controlPanelADDC: '12V',
//         controlPanelTH: '80°C',
//         controlPanelPTC: 'Disabled',
//         controlPanelAV: '220V',
//         controlPanelBYP: 'Disabled',
//       },
//     ],
//   },
//   {
//     id: 2,
//     projectName: 'Agriculture Pump System',
//     projectCode: 'AGPS002',
//     contractor: 'Farmers Group',
//     consultant: 'AgriConsult',
//     location: 'Green Valley',
//     children: [
//       {
//         projectId: 2,
//         flow: '1000 L/min',
//         head: '40m',
//         pumpSeries: 'AgriFlow',
//         pumpModel: 'AF100',
//         pumpSize: '10 inch',
//         application: 'Irrigation',
//         configuration: 'Vertical',
//         quantity: 5,
//         strainer: 'Steel',
//         flexibleConnector: 'Rubber',
//         floatSwitch: 'Automatic',
//         floatSwitchQty: 5,
//         pressureVessel: 'PV800',
//         pressureVesselBrand: 'FarmTech',
//         pressureVesselCapacity: '800L',
//         pressureVesselRating: '20 bar',
//         material: 'Steel',
//         materialQty: 3,
//         controlPanelType: 'Digital',
//         controlPanelPower: '15kW',
//         controlPanelRelay: 'Relay800',
//         controlPanelADDC: '48V',
//         controlPanelTH: '85°C',
//         controlPanelPTC: 'Enabled',
//         controlPanelAV: '240V',
//         controlPanelBYP: 'Enabled',
//       },
//     ],
//   },
// ];
  //  fetchProjectDetails(){
  //   this.project=this.dummyProjects.find(
  //     (project)=>project.id===this.projectId
  //   )!;
   
      
    
  //   console.log(this.project)
  //  }
  getAllProjectContractor(){
    this.aquaGet.getProjectContractor().subscribe(data=>{
      this.project=data;
console.log(data);
    })
  }
  getAllProjectById(){
    this.aquaGet.getProjectById(this.projectId).subscribe(data=>{
      this.projects=data;
      console.log(this.projects);
      
console.log(data);
    })
  }
  expandedRowIndex: number | null = null;

  toggleChildData(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }
}
