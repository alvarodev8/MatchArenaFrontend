import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../../reservas/reservas.service';
import { ReservationStateService } from '../../../../../core/services/reservation-state.service';
import { PitchsService } from '../../campos.service';
import { Pitch } from '../../../../../core/models/pitch.model';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-jugador-campos-reservar-pagar',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit, OnDestroy {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = true;
  pitch: Pitch | null = null;
  amount: number = 30;

  constructor(
    private reservationStateService: ReservationStateService,
    private reservasService: ReservasService,
    private pitchsService: PitchsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    // Cargar Stripe.js
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (!this.stripe) {
      this.error = 'Error al cargar la biblioteca de Stripe. Verifica tu clave pública.';
      this.isLoading = false;
      return;
    }

    this.error = null;

    const pitchId = this.route.snapshot.paramMap.get('pitchId');
    if (pitchId) {
      this.pitchsService.getPitches().subscribe({
        next: (response) => {
          this.pitch = response.pitches.find(p => p.id === +pitchId) || null;
          if (!this.pitch) {
            this.error = 'Campo no encontrado.';
          }
        },
        error: (err) => this.error = 'Error al cargar el campo: ' + (err.error?.message || err.message),
        complete: () => this.isLoading = false
      });
    } else {
      this.error = 'ID del campo no proporcionado.';
      this.isLoading = false;
    }

    const reservationData = this.reservationStateService.getReservationData();
    if (!reservationData || !reservationData.client_secret) {
      this.error = 'Datos de reserva no válidos. Por favor, vuelve a intentarlo.';
      this.isLoading = false;
      return;
    }

    this.amount = reservationData.price_hour * reservationData.duration / 60;

    try {
      if (reservationData && reservationData.client_secret) {

        if (this.stripe) {
          this.elements = this.stripe.elements();
          this.card = this.elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' }
              }
            }
          });
          const cardElement = document.getElementById('card-element');
          if (cardElement) {
            this.card.mount('#card-element');
          } else {
            this.error = 'El elemento de la tarjeta no se encontró en el DOM.';
          }
        }
      } else {
        throw new Error('No se recibió un client_secret válido del servidor.');
      }
    } catch (err: any) {
      this.error = 'Error al iniciar el pago: ' + (err.error?.message || err.message || 'Intenta de nuevo más tarde');
    }

  }

  ngOnDestroy() {
    if (this.card) this.card.unmount();
  }

  async onSubmit(): Promise<void> {
    if (!this.stripe || !this.card || this.error) {
      this.error = 'No se puede realizar el pago. Verifica el formulario.';
      return;
    }

    this.isLoading = true;
    const reservationData = this.reservationStateService.getReservationData();
    if (!reservationData || !reservationData.client_secret) {
      this.error = 'Datos de reserva no válidos.';
      this.isLoading = false;
      return;
    }

    const result = await this.stripe.confirmCardPayment(reservationData.client_secret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: 'Usuario de prueba'
        }
      }
    });

    if (result.error) {
      this.error = 'Error en el pago: ' + result.error.message;
      this.isLoading = false;
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      const reservationPayload = {
        pitch_id: reservationData.pitch_id,
        start_at: reservationData.start_at,
        duration: reservationData.duration,
        stripe_payment_intent_id: result.paymentIntent.id
      };

      this.reservasService.createReservation(reservationPayload).subscribe({
        next: (response) => {
          this.success = response.message || 'Reserva creada con éxito';
          this.reservationStateService.clearReservationData();
          setTimeout(() => {
            this.router.navigate(['/jugador/reservas'], { queryParams: { success: this.success } });
          }, 1000);
        },
        error: (err) => {
          this.error = 'Error al crear la reserva: ' + (err.error?.message || err.message);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'El pago no se completó correctamente.';
      this.isLoading = false;
    }
  }
}