import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.authService.getCurrentUser();

    if (!user) {
      // Si no hay usuario autenticado, redirige a login
      return this.router.createUrlTree(['/login']);
    }

    const role = user.role;
    const currentUrl = this.router.url;

    // Verifica si el usuario según su rol tiene que tener acceso a la URL 
    if (currentUrl.includes('/jugador') && role !== 'player') {
      return this.router.createUrlTree(['/login']);
    }
    if (currentUrl.includes('/establecimiento') && role !== 'establishment') {
      return this.router.createUrlTree(['/login']);
    }
    if (currentUrl.includes('/admin') && role !== 'admin') {
      return this.router.createUrlTree(['/login']);
    }

    return true;
  }
}