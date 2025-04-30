import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  users: User[] | null = null;
  error: string | null = null;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (users) => this.users = users,
      error: (err) => this.error = 'Error al cargar los usuarios: ' + (err.error?.message || err.message)
    });
  }
}