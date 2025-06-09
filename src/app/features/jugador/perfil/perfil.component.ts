import { Component, OnInit } from '@angular/core';
import { PerfilService } from './perfil.service';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-jugador-perfil',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  error: string | null = null;
  isLoading: boolean = true;

  constructor(private perfilService: PerfilService) { }

  ngOnInit(): void {
    this.perfilService.getProfile().subscribe({
      next: (response) => this.user = response.user,
      error: (err) => {
        this.error = 'Error al obtener el perfil: ' + (err.error?.message || err.message);
        console.error('Error al obtener el perfil:', err);
      },
      complete: () => this.isLoading = false
    });
  }
}