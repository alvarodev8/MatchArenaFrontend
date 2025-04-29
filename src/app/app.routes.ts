import { Routes } from '@angular/router';
import { JugadorLayoutComponent } from './layouts/jugador-layout/jugador-layout.component';

export const routes: Routes = [

    {
        path: 'jugador',
        component: JugadorLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./features/jugador/jugador.routes').then(r => r.jugadorRoutes) }
        ]
    },
    { path: '', redirectTo: 'jugador', pathMatch: 'full' }
];
