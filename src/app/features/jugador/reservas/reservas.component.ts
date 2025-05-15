import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservasService } from './reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jugador-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {
  reservations: Reservation[] = [];;
  error: string | null = null;

  constructor(private reservasService: ReservasService) { }

  ngOnInit(): void {
    this.reservasService.getReservations().subscribe({
      next: (reservations) => this.reservations = reservations,
      error: (err) => {
        this.error = 'Error al obtener las reservas: ' + (err.error?.message || err.message);
        console.error('Error al obtener reservas:', err);
      }
    });
  }
}
