import { Routes } from '@angular/router';
import { CamposComponent } from './campos/campos.component';
import { AddPitchComponent } from './campos/add-pitch/add-pitch.component';
import { EditPitchComponent } from './campos/edit-pitch/edit-pitch.component';

export const establecimientoRoutes: Routes = [
    { path: 'campos', component: CamposComponent },
    { path: 'campos/add', component: AddPitchComponent },
    { path: 'campos/edit/:id', component: EditPitchComponent },
    { path: '', redirectTo: 'campos', pathMatch: 'full' }
];
