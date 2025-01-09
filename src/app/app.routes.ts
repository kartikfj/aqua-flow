import { Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { SavedProjectComponent } from './saved-project/saved-project.component';




export const routes: Routes = [
    
    { path: 'create-project', component: CreateProjectComponent },
    { path: 'saved-projects', component: SavedProjectComponent },
   // { path: '', redirectTo: '/create-project', pathMatch: 'full' },
  ];