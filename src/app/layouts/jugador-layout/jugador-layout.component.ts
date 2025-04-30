import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layouts-jugador',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './jugador-layout.component.html',
  styleUrl: './jugador-layout.component.scss'
})
export class JugadorLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
