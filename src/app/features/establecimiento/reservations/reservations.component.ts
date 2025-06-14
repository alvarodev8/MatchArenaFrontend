import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
    selector: 'app-reservations',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
    reservations: Reservation[] = [];
    error: string | null = null;
    isLoading: boolean = true;
    cancellationReason: string = '';

    constructor(
        private reservationsService: ReservationsService,
    ) { }

    ngOnInit(): void {
        this.loadReservations();
    }

    loadReservations(): void {
        this.isLoading = true;
        this.reservationsService.getReservations().subscribe({
            next: (response) => this.reservations = response.reservations,
            error: (err) => this.error = 'Error al obtener las reservas: ' + (err.error?.message || err.message),
            complete: () => this.isLoading = false
        });
    }

    cancelReservation(id: number): void {
        if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            const reason = prompt('Motivo de la cancelación:') || 'Sin motivo especificado';
            this.reservationsService.cancelReservation(id, reason).subscribe({
                next: () => this.loadReservations(),
                error: (err) => this.error = 'Error al cancelar la reserva: ' + (err.error?.message || err.message),
                complete: () => { }
            });
        }
    }
}