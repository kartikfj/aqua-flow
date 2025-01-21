import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AquapostService } from '../aquapost.service';
import { AquagetService } from '../aquaget.service';
import { Project, ProjectChild, ProjectData, ProjectSerch } from '../model/Project';
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
  project:ProjectData[]=[];
  projectsChild:ProjectChild[]=[];
  isLastState = true;
  disabledButton=false;
  currentStep = 1;
  totalSteps = 5;
  currentState: 'project' | 'package' | 'addons' | 'pressureVessel' | 'controllPanel' = 'project';
  isModalOpen = false;
  isDropdownOpen = false;
  isDropdownOpenName = false;
  isDropdownOpenConstructor = false;
  constructor(private store: Store,private fb: FormBuilder, private http: HttpClient,private aquaPost:AquapostService,private aquaGet:AquagetService,private route: ActivatedRoute) {
    this.projects$ = this.store.select(selectAllChildProjects);
  }
  projects:Project[]=[];
  projectSavedData!:ProjectData;
  //projects : any[]=[];
 // Will store the filtered and limited list of projects
 filteredProjects: ProjectSerch[] = [];
 filteredProjectsName:ProjectSerch[]=[];
 filteredProjectsContractor:ProjectSerch[]=[];
 toggleDropdown(state: boolean): void {
  this.isDropdownOpen = state;
}
toggleDropdownName(state: boolean): void {
  this.isDropdownOpenName = state;
}
toggleDropdownContractor(state: boolean): void {
  this.isDropdownOpenConstructor = state;
}

// Closes the dropdown with a slight delay to allow selection
closeDropdownWithDelay(): void {
  setTimeout(() => {
    this.isDropdownOpen = false;
    this.isDropdownOpenName=false;
    this.isDropdownOpenConstructor=false;
  }, 200); // Adjust delay as needed
}

// Handles project selection
ngAfterOnInit(){
  this.getAllProjectById()
  this.getSavedProjectById();
if(this.projectId){
  this.disabledButton=true;
 // this.childDataShow(this.projectId);
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
      this.getSavedProjectById();
     // this.childDataShow(this.projectId)
     }
    })
    if(this.projectId){
      this.currentStep = 2;
      this.currentState='package'
      this.disabledButton=true;
    }
    this.projectForm = this.fb.group({

      projectName: ['',[Validators.required]],
      projectCode:['',[Validators.required]],
      contractor: ['',[Validators.required]],
      consultant: ['',[Validators.required]],
      location: ['',[Validators.required]],
    });

    this.packageForm = this.fb.group({
      flow: ['', [Validators.required]], // Min 1, Max 5000, Numbers only
      head: ['', [Validators.required]], // Min 1, Max 500, Numbers only
      pumpSeries: ['', Validators.required], // Required field
      pumpModel: ['', Validators.required], // Required field
      pumpSize: ['', Validators.required], // Required field
      application: ['', Validators.required], // Required field
      configuration: ['', Validators.required], // Required field
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]*$')]], // Min 1, Max 100, Numbers only
    //});

    //this.addonsForm = this.fb.group({
      strainer:  ['', [Validators.required]],
      flexibleConnector:  ['', [Validators.required]],
      floatSwitch: ['', [Validators.required]],
      floatSwitchQty: [1, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]*$')]],
    //});

   // this.pressureVessleForm = this.fb.group({
      pressureVessel: ['', [Validators.required]],
      pressureVesselBrand:['', [Validators.required]],
      pressureVesselCapacity:['', [Validators.required]],
      pressureVesselRating:['', [Validators.required]],
      material:['', [Validators.required]],
      materialQty:[1, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]*$')]],
    //});

   // this.controllPanelForm=this.fb.group({
    controlPanelType:['', [Validators.required]],
    controlPanelPower:['', [Validators.required]],
    controlPanelRelay:['', [Validators.required]],
    controlPanelADDC:['', [Validators.required]],
    controlPanelTH:['', [Validators.required]],
    controlPanelPTC:['', [Validators.required]],
    controlPanelAV:['', [Validators.required]],
    controlPanelBYP:['', [Validators.required]],
    });
  }

  searchProjects(event:Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (query.length>0) {
      // this.filteredProjects = this.project.filter(project =>
      //   project.projectName.toLowerCase().includes(query.toLowerCase())
      // )
      
      this.aquaGet.getProjectQuery(query)
  .subscribe(response => {
    console.log("API Response:", response); // Debugging response
    if (response ) {
      this.filteredProjects = response; 
      console.log(this.filteredProjects);
      this.isDropdownOpen = true;
    } else {
      console.error("No projects found in response:", response);
      this.filteredProjects = []; // Prevent undefined errors
    }
  });

        // Limit the results to 3 projects
    } else {
      this.filteredProjects = [];  // If query is empty, show no suggestions
    }
  }
  searchProjectsName(event:Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (query.length>0) {
      // this.filteredProjects = this.project.filter(project =>
      //   project.projectName.toLowerCase().includes(query.toLowerCase())
      // )
      
      this.aquaGet.getProjectQueryName(query)
  .subscribe(response => {
    console.log("API Response:", response); // Debugging response
    if (response ) {
      this.filteredProjectsName = response; 
      console.log(this.filteredProjectsName);
      this.isDropdownOpenName = true;
    } else {
      console.error("No projects found in response:", response);
      this.filteredProjectsName = []; // Prevent undefined errors
    }
  });

        // Limit the results to 3 projects
    } else {
      this.filteredProjects = [];  // If query is empty, show no suggestions
    }
  }
  searchProjectsContractor(event:Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (query.length>0) {
      // this.filteredProjects = this.project.filter(project =>
      //   project.projectName.toLowerCase().includes(query.toLowerCase())
      // )
      
      this.aquaGet.getProjectQueryConstructor(query)
  .subscribe(response => {
    console.log("API Response:", response); // Debugging response
    if (response ) {
      this.filteredProjectsContractor = response; 
      console.log(this.filteredProjectsContractor);
      this.isDropdownOpenConstructor = true;
    } else {
      console.error("No projects found in response:", response);
      this.filteredProjectsContractor = []; // Prevent undefined errors
    }
  });

        // Limit the results to 3 projects
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
    this.isDropdownOpenName = false;
    this.filteredProjectsName = []; 
    this.isDropdownOpenConstructor = false;
    this.filteredProjectsContractor = []; 
  }
  async saveProject() {
    if (this.currentState === 'project') {
      const projectData = this.projectForm.value;
      //this.projectId = "1";
      if (this.projectForm.invalid) {
        this.projectForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
      
        document.getElementById('openValidationModal')?.click();
       
        return;
      }
      console.log(projectData);
     await this.aquaPost.createProject(projectData).subscribe(
        (response:any)=>{ console.log(response);
          this.projectId=response.updateStatus;
          this.disabledButton=true;
          this.aquaGet.getSavedProjectById(this.projectId).subscribe(data=>{
            this.projectSavedData=data;
            console.log(this.projectSavedData);
          });
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
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
    
      document.getElementById('openValidationModal')?.click();
     
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
    }else{
      this.currentState="package";
      this.currentStep--;
      this.isLastState=true;
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
      this.childDataShow(this.projectId);
      
console.log(data);
    })
  }
  getSavedProjectById(){
    this.aquaGet.getSavedProjectById(this.projectId).subscribe(data=>{
      this.projectSavedData=data;
      this.childDataShow(this.projectId);
     // console.log(this.projects);
      
console.log(data);
    })
  }
  expandedRowIndex: number | null = null;

  toggleChildData(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }

  childDataShow(projectId: number):void {
    console.log(projectId);
    if(projectId!=null){
    this.projects.filter(childData=>{
       if(childData.id==projectId){
       // this.projectCode=childData.projectCode;
       // this.projectName=childData.projectName;
       // document.getElementById('openValidationModal')?.click();
        this.projectsChild=childData.children;
        console.log(this.projectsChild);
       }
    })
  }
}
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