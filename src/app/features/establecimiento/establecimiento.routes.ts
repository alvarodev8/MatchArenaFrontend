import { Routes } from '@angular/router';
import { CamposComponent } from './campos/campos.component';

export const establecimientoRoutes: Routes = [
    { path: 'campos', component: CamposComponent },
    { path: '', redirectTo: 'campos', pathMatch: 'full' }
];
