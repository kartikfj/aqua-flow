import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AquapostService } from '../aquapost.service';
import { AquagetService } from '../aquaget.service';
import { Project, ProjectChild, ProjectData, ProjectSerch } from '../model/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllChildProjects, selectAllProjects } from '../state/selector';
import * as ProjectActions from '../state/action';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import logoData from './logo.json'; // Import JSON file


@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf,CommonModule ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'], // Fixed typo (styleUrl -> styleUrls)
})
export class CreateProjectComponent {
  projectForm!: FormGroup;
  packageForm!: FormGroup;
  // addonsForm!: FormGroup;
  // pressureVessleForm!: FormGroup;
  // controllPanelForm!: FormGroup;
  projectCode:string='';
  projectName:string='';
  generatedCode:string='';
  contractor:string='';
  location:string='';
  consultant:string='';
  pumpSeriesOptions:string[] = [];
  rivison:number[]=[];
  selectedPumpSeries: string = '';
  selectedModelSeries: string = '';
  selectedPressureRating:string='';
  selectedPressureVessle:string='';
  selectedPressureBrand:string='';
  selectedType:string='';
  selectedControl:string='';
 
  disableSelectedPressure:boolean=true;
  isManualCostEnabled:boolean=false;
  pumpSizeOptions:string[]=[];
  pumpModelOption:string[]=[];
  applicationOptions = ['BOOSTER_ABP', 'TRANSFER_ATP', 'CIRCULATION_ACP','PRESSURIZATION_APU'];
  configurationOptions = ['DUPLEX', 'TRIPLEX'];
  strainerOptions = ['No Strainer', 'Strainer for Header','Strainer for Pump'];
  flexibleOptions = ['No Flexible Connector', 'Flexible Connector on Header (FCH)','Flexible Connector for Pump (FCP)'];
  floatOptions = ['Yes', 'No'];
  pressureVessel=['Yes','No'];
  controllPanel=['Yes','No'];

  brand=['Reflex','Feflex'];
  capacity=['60L','50L','40L'];
  pressureRating=['PN 10','PN 9','PN 8'];
  material=['Butyl'];
  type=['VFD','DOL'];
  power=[1,2];
  grandTotal:number=0;

  projects$: Observable<ProjectChild[]>;
  //projectId: string | null = null; // Stores the project ID from the backend
  projectId!: number;
  childId!:number;
  project:ProjectData[]=[];
  projectsChild:ProjectChild[]=[];

  logoUrl: string = '';
  isLastState = true;
  disabledButton=false;
  isUpdate=false;
  currentStep = 1;
  totalSteps = 5;
  currentState: 'project' | 'package' | 'addons' | 'pressureVessel' | 'controllPanel' = 'project';
  isModalOpen = false;
  isDropdownOpen = false;
  isDropdownOpenName = false;
  isDropdownOpenConstructor = false;
  constructor(private store: Store,private fb: FormBuilder, private http: HttpClient,private aquaPost:AquapostService,private aquaGet:AquagetService,private route: ActivatedRoute,private router: Router) {
    this.projects$ = this.store.select(selectAllChildProjects);
  }
  projects:Project[]=[];
  projectSavedData!:ProjectData;

  projectSavedchild!:ProjectChild;
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
  this.logoUrl = logoData.logo;
  this.getAllProjectById()
  this.getSavedProjectById();
if(this.projectId){
  this.disabledButton=true;
 // this.childDataShow(this.projectId);
}
}
  ngOnInit(): void {
    this.logoUrl = logoData.logo;
    this.getAllProjectContractor();
    this.calculateGrandTotal();
    // Initialize all forms
    this.route.params.subscribe((params)=>{
      this.projectId =+params['projectId'];
     // this.fetchProjectDetails();
     this.getPumSeries();
     this.getControlType();
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
      flow: ['', [Validators.required,Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]*\\.?[0-9]+$')]], // Min 1, Max 5000, Numbers only
      head: ['', [Validators.required,Validators.min(1), Validators.max(100), Validators.pattern('^[0-9]*\\.?[0-9]+$')]], // Min 1, Max 500, Numbers only
      priceMultipler:[1, [Validators.required,Validators.min(0.1), Validators.max(1), Validators.pattern('^[0-9]*\\.?[0-9]+$')]], // Min 1, Max 500, Numbers only
      assemblerMultipler:[1, [Validators.required,Validators.min(0.2), Validators.max(1), Validators.pattern('^[0-9]*\\.?[0-9]+$')]], // Min 1, Max 500, Numbers only
      manualCost:[{ value: 0, disabled: true }, [Validators.required,Validators.min(1), Validators.max(1000000), Validators.pattern('^[0-9]*\\.?[0-9]+$')]], // Min 1, Max 500, Numbers only
      pumpSeries: ['', Validators.required], // Required field
      pumpModel: ['', Validators.required], // Required field
      pumpSize: ['', Validators.required], // Required field
      application: ['', Validators.required], // Required field
      configuration: ['', Validators.required], // Required field
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10000), Validators.pattern('^[0-9]*$')]], // Min 1, Max 100, Numbers only
    //});

    //this.addonsForm = this.fb.group({
      strainer:  ['', [Validators.required]],
      flexibleConnector:  ['', [Validators.required]],
      floatSwitch: ['', [Validators.required]],
      floatSwitchQty: [1, [Validators.required, Validators.min(1), Validators.max(10000), Validators.pattern('^[0-9]*$')]],
    //});

   // this.pressureVessleForm = this.fb.group({
      pressureVessel: ['', [Validators.required]],
      pressureVesselBrand:[{value:'', disabled:true},[Validators.required]],
      pressureVesselCapacity:[{value:'',disabled:true}, [Validators.required]],
      pressureVesselRating:[{value:'',disabled:true}, [Validators.required]],
      material:[{value:'',disabled:true}, [Validators.required]],
      materialQty:[{value:1,disabled:true}, [Validators.required, Validators.min(1), Validators.max(10000), Validators.pattern('^[0-9]*$')]],
    //});

   // this.controllPanelForm=this.fb.group({
    needControl: ['', [Validators.required]],
    controlPanelType:['', {value:'', disabled:true},[Validators.required]],
    controlPanelPower:['', {value:'', disabled:true},[Validators.required]],
    controlPanelRelay:['', {value:'', disabled:true},[Validators.required]],
    controlPanelADDC:['', {value:'', disabled:true},[Validators.required]],
    controlPanelTH:['', {value:'', disabled:true},[Validators.required]],
    controlPanelPTC:['', {value:'', disabled:true},[Validators.required]],
    controlPanelAV:['', {value:'', disabled:true},[Validators.required]],
    controlPanelBYP:['', {value:'', disabled:true},[Validators.required]],
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
     this.aquaPost.createProject(projectData).subscribe(
        (response: any) => {
          console.log(response);
          this.projectId = response.updateStatus;
          this.disabledButton = true;
          this.aquaGet.getSavedProjectById(this.projectId).subscribe(data => {
            this.projectSavedData = data;
            console.log(this.projectSavedData);
          });
          alert(`Project Saved Successfully!,${this.projectId}`);

        },
        (error: any) => {

          document.getElementById('openValidationModal1')?.click();


        //  alert('Error Saving Project!');
          return;
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
  updatePackage() {
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
        parentSysId: this.childId,
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
         this.showToast1();
         // Automatically show the Success Modal
         const successModalElement = document.getElementById('successModal1');
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
    async AddRevisionProject() {
      console.log("data");
      console.log(this.projectsChild);
      if(this.projectsChild.length<1 || this.projectsChild==undefined){
        console.log("came");
      document.getElementById('openValidationModal2')?.click();
      return;  
    }
      this.aquaGet.getMaxRivision(this.projectSavedData.projectCode, this.projectSavedData.generatedCode)
        .pipe(
          switchMap((response: any) => {
            const rivision = response.revision || 0; // Ensure rivision is always assigned
            this.projectSavedData.revision = rivision;
          
            console.log('Revision:', rivision);
    
            if (rivision > 0) {
              console.log("Came in the revision form");
              this.projectsChild=[];
              this.projectSavedData.parentsysid=this.projectId;
              console.log(this.projectId);
              return this.aquaPost.saveRevision(this.projectSavedData);

            } else {
              console.warn("Skipping save, revision is 0.");
              return of(null); // Return an observable with null to avoid errors
            }
          })
        )
        .subscribe(
          (response: any) => {
            if (response) {
              console.log("Save response:", response);
              this.projectId = response.updateStatus;
              this.disabledButton = true;
    
              // Fetch saved project
              this.aquaGet.getSavedProjectById(this.projectId).subscribe(data => {
                this.projectSavedData = data;
                console.log("Updated Project Data:", this.projectSavedData);
                this.navigateToAddChild(this.projectId)
              });
    
              alert(`Project Saved Successfully! ID: ${this.projectId}`);
            }
          },
          (error: any) => {
            console.error("Error saving project:", error);
            document.getElementById('openValidationModal1')?.click();
          }
        );
    }
    navigateToAddChild(projectId: number) {

      this.router.navigate(['/add-child', projectId]);
    } 

    navigateToEditChild(child_id:number){
      this.isUpdate=true;
      this.childId=child_id;
      console.log(child_id);
      this.aquaGet.getSavedChildById(child_id).subscribe(data => {
        this.projectSavedchild=data;
        this.pumpModelOption.push(data.pumpModel);
        this.pumpSizeOptions.push(data.pump_size);
        this.power.push(data.controlPanelPower);
        this.pressureRating.push(data.pressureVesselRating);
        this.capacity.push(data.pressureVesselCapacity)
       // this.childDataShow(this.projectId);
       // console.log(this.projects);
       this.packageForm.patchValue({
        flow: data.flow,
        head: data.head,
        priceMultipler: data.priceMultipler,
        assemblerMultipler: data.assemblerMultipler,
        manualCost: data.manualCost,
        pumpSeries: data.pump_series,
        pumpModel: data.pumpModel,

        pumpSize: data.pump_size,
        application: data.application, // Assuming this value is static
        configuration: data.configuration,
        quantity: data.quantity,
        
        // Addons
        strainer: data.strainer,
        flexibleConnector: data.flexConnector,
        floatSwitch: data.floatswitch,
        floatSwitchQty: data.floatswitchQty,
  
        // Pressure Vessel
        pressureVessel: data.pressureVessel,
        pressureVesselBrand: data.pressureVesselBrand,
        pressureVesselCapacity: data.pressureVesselCapacity,
        pressureVesselRating: data.pressureVesselRating,
        material: data.materail,  // Typo fixed
        materialQty: data.materailQty,
  
        // Control Panel
        needControl: data.needControl,
        controlPanelType: data.controlPanelType,  // Set dynamically if needed
        controlPanelPower: data.controlPanelPower,
        controlPanelRelay: data.controlPanelMonitorRelay,
        controlPanelADDC: data.controlPanelADDC,
        controlPanelTH: data.controlPanelTH,
        controlPanelPTC: data.controlPanelPTC,
        controlPanelAV: data.controlPanelAV,
        controlPanelBYP: data.controlPanelBYP,
      });
      console.log(this.projectSavedchild);
    })
  }
  OldRevisionProject(){
   console.log("data came")
   this.aquaGet.getAllRivision(this.projectSavedData.projectCode, this.projectSavedData.generatedCode).subscribe((response:any)=>{
    console.log(response);
    this.rivison=response.revision;
    
   })
  }
  getRivisionById(id:number){
    console.log(id);
    this.projectSavedData.revision = id;
    this.aquaGet.getRivisionById(this.projectSavedData.projectCode,this.projectSavedData.generatedCode,id).subscribe((response:any)=>{
      console.log(response);
      this.projectId=response.projectId;
      this.navigateToAddChild(this.projectId);
      this.projectsChild=[];
      this.getSavedProjectById()
    })
    

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
  showToast1() {
    const toastElement = document.getElementById('successToast1');
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
  getControlType(){
    this.aquaGet.getControlType().subscribe(data=>{
      this.type=data;
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
  onSelectedPressureVessel(event:any){
    console.log("data came");
    this.selectedPressureVessle=event.target.value;
    if(this.selectedPressureVessle=='Yes'){
      this.packageForm.controls['pressureVesselBrand'].enable();  // Enable
      this.packageForm.controls['pressureVesselCapacity'].enable(); // Disable
      this.packageForm.controls['pressureVesselRating'].enable();  // Enable
      this.packageForm.controls['material'].enable(); // Disable
      this.packageForm.controls['materialQty'].enable(); // Disable
    }
    else{
      this.packageForm.controls['pressureVesselBrand'].disable();  // Enable
      this.packageForm.controls['pressureVesselCapacity'].disable(); // Disable
      this.packageForm.controls['pressureVesselRating'].disable();  // Enable
      this.packageForm.controls['material'].disable(); // Disable
      this.packageForm.controls['materialQty'].disable(); // Disable
    }
  }
  onSelectedControlPanel(event:any){
    console.log("data came");
    this.selectedControl=event.target.value;
    if(this.selectedControl=='Yes'){
      this.packageForm.controls['controlPanelType'].enable();
      this.packageForm.controls['controlPanelPower'].enable();
      this.packageForm.controls['controlPanelRelay'].enable();
      this.packageForm.controls['controlPanelADDC'].enable();
      this.packageForm.controls['controlPanelTH'].enable();
      this.packageForm.controls['controlPanelPTC'].enable();
      this.packageForm.controls['controlPanelAV'].enable();
      this.packageForm.controls['controlPanelBYP'].enable();
    }
    else{
      this.packageForm.controls['controlPanelType'].disable();
      this.packageForm.controls['controlPanelPower'].disable();
      this.packageForm.controls['controlPanelRelay'].disable();
      this.packageForm.controls['controlPanelADDC'].disable();
      this.packageForm.controls['controlPanelTH'].disable();
      this.packageForm.controls['controlPanelPTC'].disable();
      this.packageForm.controls['controlPanelAV'].disable();
      this.packageForm.controls['controlPanelBYP'].disable();
    }
  }
  onToggleManualCost(event: Event) {
    this.isManualCostEnabled = (event.target as HTMLInputElement).checked;
    if (this.isManualCostEnabled) {
      this.packageForm.controls['manualCost'].enable();
    } else {
      this.packageForm.controls['manualCost'].disable();
      this.packageForm.controls['manualCost'].setValue(''); // Optional: Reset value when disabled
    }
  }
  onSelectedPressureBrand(event:any){
    console.log("data came");
    this.selectedPressureBrand=event.target.value;
    if(this.selectedPressureBrand){
      this.aquaGet.getPressureRating(this.selectedPressureBrand).subscribe(data=>{
        this.pressureRating=data;
        console.log(this.pressureRating);
      },(error)=>{
        console.log('fetching data',error);
      })
    }
  }
  onSelectedPressureRating(event:any){
    console.log("data came");
    this.selectedPressureRating=event.target.value;
    if(this.selectedPressureRating){
      this.aquaGet.getPressureCapacity(this.selectedPressureRating).subscribe(data=>{
        this.capacity=data;
      })
    
    }
  }
  onSelectedType(event:any){
    console.log("data came");
    this.selectedType=event.target.value;
    if(this.selectedType){
      this.aquaGet.getPowerAddOnes(this.selectedType).subscribe(data=>{
        this.power=data;
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
        this.projectCode=childData.projectCode;
        this.projectName=childData.projectName;
        this.generatedCode=childData.generatedCode;
        this.contractor=childData.contractor;
        this.location=childData.location;
        this.consultant=childData.consultant;
        this.calculateGrandTotal();
        console.log(this.projectsChild);
       }
    })
  }
}
calculateGrandTotal() {
  this.grandTotal = this.projectsChild.reduce((sum, child) => sum + (child.TOTALCOST || 0), 0);
}



exportToExcel() {
  let exportData: any[] = [];
  
  this.projects.forEach(project => {
    exportData.push({
      "Project Code": project.projectCode,
      "Generated Code": this.projectSavedData.generatedCode+'/R'+this.projectSavedData.revision,
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
       
        "Strainer": child.strainer,
        
      });
    });
  });
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  XLSX.writeFile(workbook, 'ProjectReport.xlsx');
}
// printTable() {
//     const printContent = document.getElementById('tableToPrint');
//     const WindowPrt = window.open('', '', 'width=900,height=700');
//     WindowPrt?.document.write('<html><head><title>Print Report</title></head><body>');
//     WindowPrt?.document.write(printContent?.outerHTML || '');
//     WindowPrt?.document.write('</body></html>');
//     WindowPrt?.document.close();
//     WindowPrt?.focus();
//     WindowPrt?.print();
//     WindowPrt?.close();
//   }
  
printTable() {
  const printContent = document.getElementById('tableToPrint');
  const buttons = document.querySelectorAll('.btn') as NodeListOf<HTMLElement>;
  buttons.forEach(button => button.style.display = 'none');
  const logoUrl = this.logoUrl;

  const currentDate = new Date().toLocaleDateString(); // Get the current date
  const logoImage = new Image();
  logoImage.src = logoUrl;

  logoImage.onload = () => {

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
          <div class="date" style="color:#103d63">Date: ${currentDate}</div>
        </div>
      
        <strong class="text-dark">Generated Code:</strong>
        <span class="text-muted">${this.projectSavedData.generatedCode}/R${this.projectSavedData.revision}</span>
        <br>
        <br>
        <strong class="text-dark">Project Code:</strong>
        <span class="text-muted">${this.projectCode}</span>
        <br>
        <br>
        <strong class="text-dark">Project Name:</strong>
        <span class="text-muted"> ${this.projectName}</span>
        <br>
        <br>
        <strong class="text-dark">Contractor:</strong>
        <span class="text-muted">${this.contractor}</span>
        <br>
        <br>
        <strong class="text-dark">Consultant:</strong>
        <span class="text-muted"> ${this.consultant}</span>
        <br>
        <br>
        <strong class="text-dark">Location:</strong>
        <span class="text-muted">${this.location}</span>
        <br>
        <br>
        ${printContent?.outerHTML || ''}
      </body>
    </html>
  `);

  WindowPrt?.document.close();
  WindowPrt?.focus();
  WindowPrt?.print();
  WindowPrt?.close();

  buttons.forEach(button => button.style.display = 'inline-block');
  };

  // if (logoImage.complete) {
  //   logoImage.onload = null; // Prevent the onload from firing again
  //   logoImage.src = logoUrl; // Reassign to trigger the logic
  // }
  // else{
  //   logoImage.src = null;
  // }
  
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