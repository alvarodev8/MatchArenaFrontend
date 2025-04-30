import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layouts-establecimiento',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './establecimiento-layout.component.html',
  styleUrl: './establecimiento-layout.component.scss'
})
export class EstablecimientoLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
