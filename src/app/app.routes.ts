import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { JugadorLayoutComponent } from './layouts/jugador-layout/jugador-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            ...authRoutes,
        ],
    },
    {
        path: 'jugador',
        component: JugadorLayoutComponent,
        canActivate: [AuthGuard],
        data: { role: 'player' },
        children: [
            { path: '', loadChildren: () => import('./features/jugador/jugador.routes').then(r => r.jugadorRoutes) }
        ],
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { role: 'admin' },
        children: [
            { path: '', loadChildren: () => import('./features/admin/admin.routes').then(r => r.adminRoutes) }
        ],
    },
    { path: '**', redirectTo: '' }
];
