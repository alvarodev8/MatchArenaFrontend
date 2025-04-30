import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getCurrentUser();

    if (!user) {
      // Si no hay usuario autenticado, redirige a login
      this.router.createUrlTree(['/login']);
      return false;
    }

    // Verifica si el usuario según su rol tiene que tener acceso a la URL 
    const expectedRole = route.data['role'];
    if (expectedRole && user.role !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}