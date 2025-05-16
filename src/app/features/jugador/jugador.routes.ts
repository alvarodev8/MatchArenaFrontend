import { Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { ReservasComponent } from './reservas/reservas.component';
import { CamposComponent } from './campos/campos.component';
import { ReservaFormComponent } from './campos/reservar/reservar.component';
import { CampoDetallesComponent } from './campos/detalle/detalle.component';

export const jugadorRoutes: Routes = [
    { path: 'perfil', component: PerfilComponent },
    { path: 'reservas', component: ReservasComponent },
    { path: 'campos', component: CamposComponent },
    { path: 'campos/:id/detalles', component: CampoDetallesComponent },
    { path: 'reserva', component: ReservaFormComponent },
    { path: 'reserva/:pitchId', component: ReservaFormComponent },
    { path: '', redirectTo: 'perfil', pathMatch: 'full' }
];
