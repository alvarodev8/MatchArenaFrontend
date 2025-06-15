import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EditUsuarioComponent } from './usuarios/edit-usuario/edit-usuario.component';
import { CreateUsuarioComponent } from './usuarios/create-usuario/create-usuario.component';
import { UserReservationsComponent } from './usuarios/user-reservations/user-reservations.component';

export const adminRoutes: Routes = [
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'usuarios/:id/edit', component: EditUsuarioComponent },
    { path: 'usuarios/create', component: CreateUsuarioComponent },
    { path: 'usuarios/:id/reservations', component: UserReservationsComponent },
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
];
