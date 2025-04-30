import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layouts-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

