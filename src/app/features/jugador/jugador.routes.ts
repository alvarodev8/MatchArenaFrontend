import { Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { ReservasComponent } from './reservas/reservas.component';
import { CamposComponent } from './campos/campos.component';

export const jugadorRoutes: Routes = [
    { path: 'perfil', component: PerfilComponent },
    { path: 'reservas', component: ReservasComponent },
    { path: 'campos', component: CamposComponent },
    { path: '', redirectTo: 'perfil', pathMatch: 'full' }
];
