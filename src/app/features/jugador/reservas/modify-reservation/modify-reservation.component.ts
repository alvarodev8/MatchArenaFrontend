import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservasService } from '../../reservas/reservas.service';
import { Reservation } from '../../../../core/models/reservation.model';
import { CalendarComponent } from '../../campos/reservar/calendar/calendar.component';
import { format, addDays, startOfToday, parseISO } from 'date-fns';
import { Pitch } from '../../../../core/models/pitch.model';

@Component({
  selector: 'app-modify-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './modify-reservation.component.html',
  styleUrls: ['./modify-reservation.component.scss']
})
export class ModifyReservationComponent implements OnInit {
  @Input() reservation!: Reservation;
  pitch: Pitch | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  newDuration: number = 60;
  error: string | null = null;
  isLoading: boolean = false;
  isFormValid: boolean = false;
  minDate: string = '';
  maxDate: string = '';
  availableTimes: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private reservasService: ReservasService
  ) { }

  ngOnInit(): void {
    if (this.reservation && this.reservation.pitch) {
      this.pitch = this.reservation.pitch;
      const today = startOfToday();
      this.minDate = format(today, 'yyyy-MM-dd');
      this.maxDate = format(addDays(today, 14), 'yyyy-MM-dd');
      this.selectedDate = format(this.reservation.start_at, 'yyyy-MM-dd');
      this.selectedTime = format(this.reservation.start_at, 'HH:mm');
      this.newDuration = this.reservation.duration;
      this.updateAvailableTimes();
      this.checkAvailability();
    } else {
      this.error = 'No se pudo cargar la reserva o el campo asociado.';
      this.activeModal.dismiss('Error');
    }
  }

  updateAvailableTimes(): void {
    if (!this.pitch || !this.selectedDate) return;

    this.reservasService.getAvailableTimes(this.pitch.id, this.selectedDate).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes;
        if (!this.availableTimes.includes(this.selectedTime) && this.availableTimes.length > 0) {
          this.selectedTime = this.availableTimes[0];
        }
        this.checkAvailability();
      },
      error: (err) => this.error = 'Error al cargar horas disponibles: ' + (err.error?.message || err.message)
    });
  }

  onDateSelected(event: string): void {
    this.selectedDate = event;
    this.updateAvailableTimes();
  }

  checkAvailability(): void {
    this.error = null;
    this.isFormValid = false;

    if (!this.pitch || !this.selectedDate || !this.selectedTime || !this.newDuration) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    const startAt = `${this.selectedDate} ${this.selectedTime}:00`;
    const reservationData = {
      pitch_id: this.pitch.id,
      start_at: startAt,
      duration: this.newDuration,
      current_reservation_id: this.reservation.id
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

  modifyReservation(): void {
    if (!this.isFormValid || !this.reservation || !this.pitch) {
      this.error = 'No se puede modificar la reserva. Verifica los datos.';
      return;
    }

    this.isLoading = true;
    const startAt = `${this.selectedDate} ${this.selectedTime}:00`;
    this.reservasService.modifyReservation(this.reservation.id, { start_at: startAt, duration: this.newDuration,
    }).subscribe({
      next: (response) => {
        this.activeModal.close();
      },
      error: (err) => {
        this.error = 'Error al modificar la reserva: ' + (err.error?.message || err.message);
        if (err.status === 409) {
          this.error += ' El tramo original ya no está disponible. Por favor, selecciona otro horario.';
        }
      },
      complete: () => this.isLoading = false
    });
  }
}