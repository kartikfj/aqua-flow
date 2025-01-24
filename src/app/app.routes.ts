import { Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SavedProjectComponent } from './saved-project/saved-project.component';
import { HomeComponent } from './home/home.component';




export const routes: Routes = [
    
    { path: 'create-project', component: CreateProjectComponent },
    { path: 'saved-projects', component: SavedProjectComponent },
    { path: 'add-child/:projectId', component: CreateProjectComponent},
    { path:'home',component:HomeComponent},
    { path:'home/:empId',component:HomeComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
  ];