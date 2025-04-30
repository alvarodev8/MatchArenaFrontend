import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { JugadorLayoutComponent } from './layouts/jugador-layout/jugador-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes) },
            { path: 'login', loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes) },
            { path: 'register', loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes) }
        ]
    },
    {
        path: 'jugador',
        component: JugadorLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('./features/jugador/jugador.routes').then(r => r.jugadorRoutes) }
        ]
    },
    { path: '**', redirectTo: '' }
];
