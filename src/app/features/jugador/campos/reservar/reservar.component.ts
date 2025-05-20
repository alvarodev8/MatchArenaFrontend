import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../reservas/reservas.service';
import { PitchsService } from '../campos.service';
import { Pitch } from '../../../../core/models/pitch.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-jugador-campos-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss']
})
export class ReservaFormComponent implements OnInit {
  pitch: Pitch | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  duration: number = 60;
  error: string | null = null;
  success: string | null = null;
  minDate: string = '';
  maxDate: string = '';
  availableTimes: string[] = [];
  isFormValid: boolean = false;

  constructor(
    private pitchsService: PitchsService,
    private reservasService: ReservasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0];
    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 15);
    this.maxDate = maxDate.toISOString().split('T')[0];

    const pitchId = this.route.snapshot.paramMap.get('pitchId');
    if (pitchId) {
      this.pitchsService.getPitches().subscribe({
        next: (pitches) => {
          this.pitch = pitches.find(p => p.id === +pitchId) || null;
          if (!this.pitch) {
            this.error = 'Campo no encontrado.';
          } else {
            this.initializeDateAndTimes();
          }
        },
        error: (err) => this.error = 'Error al cargar el campo: ' + (err.error?.message || err.message)
      });
    }
  }

  private initializeDateAndTimes(): void {
    const now = new Date();
    let currentDate = new Date(now);
    let foundAvailableDate = false;

    this.selectedDate = currentDate.toISOString().split('T')[0];

    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    let startHour = Math.max(currentHour, 8);
    if (currentHour >= 22) {
      startHour = 8;
      currentDate.setDate(currentDate.getDate() + 1);
      this.selectedDate = currentDate.toISOString().split('T')[0];
    } else {
      const nextHalfHour = Math.ceil(currentMinutes / 30) * 30;
      if (nextHalfHour === 60) {
        startHour += 1;
      } else {
        startHour = currentHour + (nextHalfHour === 0 ? 0 : 1);
      }
    }

    const minHour = `${String(startHour).padStart(2, '0')}:00`;

    // Verificar el día actual
    this.reservasService.getAvailableTimes(this.pitch!.id, this.selectedDate).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes.filter(time => 
          this.selectedDate === now.toISOString().split('T')[0] ? time >= minHour : true
        );

        if (this.availableTimes.length > 0) {
          this.selectedTime = this.availableTimes[0];
          foundAvailableDate = true;
          this.checkAvailability();
        } else {
          // Si no hay horarios disponibles, buscar el siguiente día con disponibilidad
          const maxDate = new Date(this.maxDate);
          currentDate.setDate(currentDate.getDate() + 1); // Empezar desde el siguiente día
          this.findNextAvailableDate(currentDate, maxDate, now, foundAvailableDate);
        }
      },
      error: (err) => this.error = 'Error al verificar disponibilidad: ' + (err.error?.message || err.message)
    });
  }

  private findNextAvailableDate(currentDate: Date, maxDate: Date, now: Date, foundAvailableDate: boolean): void {
    if (currentDate > maxDate) {
      this.error = 'No hay horarios disponibles en los próximos 15 días.';
      return;
    }

    const dateStr = currentDate.toISOString().split('T')[0];
    this.reservasService.getAvailableTimes(this.pitch!.id, dateStr).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes;
        if (this.availableTimes.length > 0) {
          this.selectedDate = dateStr;
          this.selectedTime = this.availableTimes[0];
          foundAvailableDate = true;
          this.checkAvailability();
        } else {
          currentDate.setDate(currentDate.getDate() + 1);
          this.findNextAvailableDate(currentDate, maxDate, now, foundAvailableDate);
        }
      },
      error: (err) => this.error = 'Error al verificar disponibilidad: ' + (err.error?.message || err.message)
    });
  }

  updateAvailableTimes(): void {
    if (!this.pitch || !this.selectedDate) return;
    const now = new Date();
    this.reservasService.getAvailableTimes(this.pitch.id, this.selectedDate).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes.filter(time => 
          this.selectedDate === now.toISOString().split('T')[0] ? time >= this.getMinHour(now) : true
        );
        if (this.availableTimes.length > 0) {
          this.selectedTime = this.availableTimes[0];
        } else {
          // Si no hay horarios disponibles, buscar el siguiente día
          const maxDate = new Date(this.maxDate);
          const currentDate = new Date(this.selectedDate);
          currentDate.setDate(currentDate.getDate() + 1);
          this.findNextAvailableDate(currentDate, maxDate, now, false);
          return;
        }
        this.checkAvailability();
      },
      error: (err) => this.error = 'Error al cargar horas disponibles: ' + (err.error?.message || err.message)
    });
  }

  private getMinHour(now: Date): string {
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    let startHour = Math.max(currentHour, 8);
    const nextHalfHour = Math.ceil(currentMinutes / 30) * 30;
    if (nextHalfHour === 60) {
      startHour += 1;
    } else {
      startHour = currentHour + (nextHalfHour === 0 ? 0 : 1);
    }
    return `${String(startHour).padStart(2, '0')}:00`;
  }

  checkAvailability(): void {
    this.error = null;
    this.isFormValid = false;

    if (!this.pitch || !this.selectedDate || !this.selectedTime || !this.duration) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    const startAt = `${this.selectedDate} ${this.selectedTime}:00`;
    const reservationData = {
      pitch_id: this.pitch.id,
      start_at: startAt,
      duration: this.duration
    };

    this.reservasService.checkAvailability(reservationData).subscribe({
      next: (response) => {
        if (response.available) {
          this.isFormValid = true;
          this.error = null;
        } else {
          this.error = `El horario seleccionado no está disponible: ${response.message || 'Ya existe una reserva en este horario.'}`;
          this.isFormValid = false;
        }
      },
      error: (err) => {
        this.error = 'Error al verificar la disponibilidad: ' + (err.error?.message || 'Intenta de nuevo más tarde');
        this.isFormValid = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.isFormValid || this.error) {
      this.error = 'No se puede realizar la reserva. Verifica la disponibilidad.';
      return;
    }

    const startAt = `${this.selectedDate} ${this.selectedTime}:00`;
    const reservationData = {
      pitch_id: this.pitch!.id,
      start_at: startAt,
      duration: this.duration
    };

    this.reservasService.createReservation(reservationData).subscribe({
      next: (response) => {
        this.success = 'Reserva creada con éxito.';
        this.updateAvailableTimes();
        setTimeout(() => this.router.navigate(['/jugador/reservas']), 2000);
      },
      error: (err) => {
        this.error = 'Error al crear la reserva: ' + (err.error?.message || err.message);
      }
    });
  }
}