import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const adminRoutes: Routes = [
    { path: 'usuarios', component: UsuariosComponent },
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];
