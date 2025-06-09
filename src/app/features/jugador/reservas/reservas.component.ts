import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservasService } from './reservas.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-jugador-reservas',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {
  reservations: Reservation[] = [];
  successMessage: string | null = null;
  error: string | null = null;
  isLoading: boolean = true;

  constructor(
    private reservasService: ReservasService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['success'] || null;
    });

    this.loadReservations();
  }

  loadReservations(): void {
    this.reservasService.getReservations().subscribe({
      next: (response) => this.reservations = response.reservations || [],
      error: (err) => {
        this.error = 'Error al obtener las reservas: ' + (err.error?.message || err.message);
        console.error('Error al obtener reservas:', err);
      },
      complete: () => this.isLoading = false
    });
  }

}
