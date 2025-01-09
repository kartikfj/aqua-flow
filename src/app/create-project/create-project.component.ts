import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AquapostService } from '../aquapost.service';
import { AquagetService } from '../aquaget.service';

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
  addonsForm!: FormGroup;
  pressureVessleForm!: FormGroup;
  controllPanelForm!: FormGroup;

  pumpSeriesOptions = ['e-SV', 'e-MP', 'e-HM'];
  applicationOptions = ['BOOSTER', 'TRANSFER', 'CIRCULATION'];
  configurationOptions = ['DUPLEX', 'TRIPLEX'];
  strainerOptions = ['No Strainer', 'Strainer'];
  flexibleOptions = ['No Flexible', 'Flexible'];
  floatOptions = ['Yes', 'No'];

  projectId: string | null = null; // Stores the project ID from the backend
  isLastState = true;
  currentStep = 1;
  totalSteps = 5;
  currentState: 'project' | 'package' | 'addons' | 'pressureVessel' | 'controllPanel' = 'project';

  constructor(private fb: FormBuilder, private http: HttpClient,private aquaPost:AquapostService,private aquaGet:AquagetService) {}

  ngOnInit(): void {
    // Initialize all forms
    this.projectForm = this.fb.group({
      projectName: [''],
      contractor: [''],
      consultant: [''],
      location: [''],
    });

    this.packageForm = this.fb.group({
      flow: [''],
      head: [''],
      pumpSeries: [''],
      pumpSize: [''],
      application: [''],
      configuration: [''],
      qty: [0],
    });

    this.addonsForm = this.fb.group({
      strainer: [''],
      flexibleConnector: [''],
      floatSwitch: [''],
      floatQty: [''],
    });

    this.pressureVessleForm = this.fb.group({
      pressureVessel: [''],
      brand:[''],
      capacity:[''],
      pressureRating:[''],
      material:[''],
      qty:[''],
    });

    this.controllPanelForm=this.fb.group({
      type:[''],
      power:[''],
      uvr:[''],
      addc:[''],
      th:[''],
      ptc:[''],
      av:[''],
      vfd:['']
    })
  }

  saveProject() {
    if (this.currentState === 'project') {
      const projectData = this.projectForm.value;
      this.projectId = "1";
      console.log(projectData);
      this.aquaPost.createProject(projectData).subscribe(
        (response:any)=>{
          this.projectId=response.id;
          alert('Project Saved Successfully!')
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

  savePackage() {
    if (!this.projectId) {
      alert('Please create a project first!');
      return;
    }

    const packageData = {
      ...this.packageForm.value,
      projectId: this.projectId,
    };
    console.log(packageData);
    this.aquaPost.savePackage(packageData).subscribe(
      (response)=>{
        alert('package set saved successffully');
      },
      (error)=>{
        alert('Error saving package set. Please Try again.')
      }
    )
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

    const addonsData = {
      ...this.addonsForm.value,
      projectId: this.projectId,
    };
   // console.log(addonsData);
     this.aquaPost.saveAddons(addonsData).subscribe(
      (response)=>{
        alert('Add-ons saved successfully');
      },
      (error)=>{
        alert('Error saving add-one. Please try again');
      }
     )
    // this.http.post('/api/addons', addonsData).subscribe(
    //   () => {
    //     alert('Add-ons saved successfully!');
    //   },
    //   (error) => {
    //     alert('Error saving add-ons. Please try again.');
    //     console.error(error);
    //   }
    // );
  }
  savePressureVessle() {
    this.projectId = "1";
    if (!this.projectId) {
      alert('Please create a project first!');
      return;
    }

    const pressureVessleForm = {
      ...this.pressureVessleForm.value,
      projectId: this.projectId,
    };
   console.log(pressureVessleForm);
    //  this.aquaPost.saveAddons(addonsData).subscribe(
    //   (response)=>{
    //     alert('Add-ons saved successfully');
    //   },
    //   (error)=>{
    //     alert('Error saving add-one. Please try again');
    //   }
    //  )
    }
    saveControllPanel() {
      this.projectId = "1";
      if (!this.projectId) {
        alert('Please create a project first!');
        return;
      }
  
      const controllPanel = {
        ...this.controllPanelForm.value,
        projectId: this.projectId,
      };
     console.log(controllPanel);
      //  this.aquaPost.saveAddons(addonsData).subscribe(
      //   (response)=>{
      //     alert('Add-ons saved successfully');
      //   },
      //   (error)=>{
      //     alert('Error saving add-one. Please try again');
      //   }
      //  )
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
}
