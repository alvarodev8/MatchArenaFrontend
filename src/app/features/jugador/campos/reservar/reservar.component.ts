import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../reservas/reservas.service';
import { PitchsService } from '../campos.service';
import { Pitch } from '../../../../core/models/pitch.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { format, addDays, startOfToday, isAfter, parseISO } from 'date-fns';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ReservationStateService } from '../../../../core/services/reservation-state.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-jugador-campos-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, LoadingComponent],
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
  isLoading: boolean = true;

  constructor(
    private pitchsService: PitchsService,
    private reservasService: ReservasService,
    private reservationStateService: ReservationStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.error = null;
    const today = startOfToday();
    this.minDate = format(today, 'yyyy-MM-dd');
    this.maxDate = format(addDays(today, 14), 'yyyy-MM-dd');

    const pitchId = this.route.snapshot.paramMap.get('pitchId');
    if (pitchId) {
      this.pitchsService.getPitches().subscribe({
        next: (response) => {
          this.pitch = response.pitches.find(p => p.id === +pitchId) || null;
          if (!this.pitch) {
            this.error = 'Campo no encontrado.';
          } else {
            this.initializeDateAndTimes();
          }
        },
        error: (err) => this.error = 'Error al cargar el campo: ' + (err.error?.message || err.message),
        complete: () => this.isLoading = false
      });
    } else {
      this.error = 'ID del campo no proporcionado.';
      this.isLoading = false;
    }
  }

  private initializeDateAndTimes(): void {
    if (!this.pitch) {
      this.error = 'Campo no cargado correctamente.';
      return;
    }

    const today = startOfToday();
    this.selectedDate = format(today, 'yyyy-MM-dd');

    this.reservasService.getAvailableTimes(this.pitch!.id, this.selectedDate).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes.filter((time: string) => {
          const [hours] = time.split(':').map(Number);
          return this.selectedDate === this.minDate ? hours >= 8 : true;
        });

        if (this.availableTimes.length > 0) {
          this.selectedTime = this.availableTimes[0];
          this.checkAvailability();
        } else {
          this.findNextAvailableDate(addDays(today, 1));
        }
      },
      error: (err) => this.error = 'Error al verificar disponibilidad: ' + (err.error?.message || err.message)
    });
  }

  private findNextAvailableDate(currentDate: Date): void {
    if (isAfter(currentDate, parseISO(this.maxDate))) {
      this.error = 'No hay horarios disponibles en las próximas 2 semanas.';
      return;
    }

    const dateStr = format(currentDate, 'yyyy-MM-dd');
    this.reservasService.getAvailableTimes(this.pitch!.id, dateStr).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes;

        if (this.availableTimes.length > 0) {
          this.selectedDate = dateStr;
          this.selectedTime = this.availableTimes[0];
          this.checkAvailability();
        } else {
          this.findNextAvailableDate(addDays(currentDate, 1));
        }
      },
      error: (err) => this.error = 'Error al verificar disponibilidad: ' + (err.error?.message || err.message)
    });
  }

  updateAvailableTimes(): void {
    if (!this.pitch || !this.selectedDate) return;

    this.reservasService.getAvailableTimes(this.pitch.id, this.selectedDate).subscribe({
      next: (response) => {
        this.availableTimes = response.availableTimes.filter((time: string) => {
          const [hours] = time.split(':').map(Number);
          return this.selectedDate === this.minDate ? hours >= 8 : true;
        });

        if (this.availableTimes.length > 0) {
          this.selectedTime = this.availableTimes[0];
          this.checkAvailability();
        } else {
          this.findNextAvailableDate(addDays(parseISO(this.selectedDate), 1));
        }
      },
      error: (err) => this.error = 'Error al cargar horas disponibles: ' + (err.error?.message || err.message)
    });
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

  async createPaymentIntent(): Promise<void> {
    if (!this.isFormValid || this.error || !this.pitch) {
      this.error = 'No se puede iniciar el pago. Verifica la disponibilidad.';
      return;
    }

    this.isLoading = true;
    const startAt = `${this.selectedDate} ${this.selectedTime}:00`;
    const paymentIntentData = {
      pitch_id: this.pitch.id,
      start_at: startAt,
      price_hour: this.pitch.price,
      duration: this.duration
    };

    try {
      const response = await lastValueFrom(this.reservasService.createPaymentIntent(paymentIntentData));
      if (response && response.client_secret) {
        this.reservationStateService.setReservationData({
          pitch_id: this.pitch.id,
          start_at: startAt,
          price_hour: this.pitch.price,
          duration: this.duration,
          client_secret: response.client_secret
        });
        this.router.navigate([`/jugador/campo/${this.pitch.id}/reservar/pagar`]);
      } else {
        throw new Error('No se recibió un client_secret válido del servidor.');
      }
    } catch (err: any) {
      this.error = 'Error al iniciar el pago: ' + (err.error?.message || err.message || 'Intenta de nuevo más tarde');
    } finally {
      this.isLoading = false;
    }
  }
}