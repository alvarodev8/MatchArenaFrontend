import { Component, OnInit } from '@angular/core';
import { PerfilService } from './perfil.service';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jugador-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  error: string | null = null;

  constructor(private perfilService: PerfilService) { }

  ngOnInit(): void {
    this.perfilService.getProfile().subscribe({
      next: (user) => this.user = user,
      error: (err) => {
        this.error = 'Error al obtener el perfil: ' + (err.error?.message || err.message);
        console.error('Error al obtener el perfil:', err);
      }
    });
  }
}