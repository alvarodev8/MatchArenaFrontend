import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../reservas/reservas.service';
import { PitchsService } from '../campos.service';
import { Pitch } from '../../../../core/models/pitch.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jugador-campos-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss']
})
export class ReservaFormComponent implements OnInit {
  pitch: Pitch | null = null;
  startAt: string = '';
  duration: number = 60;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private pitchsService: PitchsService,
    private reservasService: ReservasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pitchId = this.route.snapshot.paramMap.get('pitchId');
    if (pitchId) {
      this.pitchsService.getPitches().subscribe({
        next: (pitches) => {
          this.pitch = pitches.find(p => p.id === +pitchId) || null;
          if (!this.pitch) {
            this.error = 'Campo no encontrado.';
          }
        },
        error: (err) => this.error = 'Error al cargar el campo: ' + (err.error?.message || err.message)
      });
    }
  }

  onSubmit(): void {
    if (!this.pitch || !this.startAt || !this.duration) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    const reservationData = {
      pitch_id: this.pitch.id,
      start_at: this.startAt,
      duration: this.duration
    };

    this.reservasService.createReservation(reservationData).subscribe({
      next: (response) => {
        this.success = 'Reserva creada con éxito.';
        setTimeout(() => this.router.navigate(['/jugador/reservas']), 2000);
      },
      error: (err) => {
        this.error = 'Error al crear la reserva: ' + (err.error?.message || err.message);
      }
    });
  }
}