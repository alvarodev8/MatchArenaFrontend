import { Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { PartidosComponent } from './partidos/partidos.component';
import { CamposComponent } from './campos/campos.component';

export const jugadorRoutes: Routes = [
    { path: 'perfil', component: PerfilComponent },
    { path: 'partidos', component: PartidosComponent },
    { path: 'campos', component: CamposComponent },
    { path: '', redirectTo: 'perfil', pathMatch: 'full' }
];
