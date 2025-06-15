import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  users: User[] | null = null;
  error: string | null = null;
  isLoading: boolean = true;

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (response) => this.users = response.users,
      error: (err) => this.error = 'Error al cargar los usuarios: ' + (err.error?.message || err.message),
      complete: () => this.isLoading = false,
    });
  }

  viewReservations(userId: number): void {
    this.router.navigate([`/admin/usuarios/${userId}/reservations`]);
  }

  crearUsuario() {
    this.router.navigate(['/admin/usuarios/create'])
  }

  editUser(userId: number): void {
    this.router.navigate([`/admin/usuarios/${userId}/edit`]);
  }

  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(userId).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => this.error = 'Error al eliminar el usuario: ' + (err.error?.message || err.message),
      });
    }
  }
}