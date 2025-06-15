import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { Reservation } from '../../../../core/models/reservation.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
    selector: 'app-user-reservations',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './user-reservations.component.html',
    styleUrls: ['./user-reservations.component.scss']
})
export class UserReservationsComponent implements OnInit {
    reservations: Reservation[] | null = null;
    error: string | null = null;
    isLoading: boolean = true;
    userId: number | null = null;
    cancellationReason: string = 'Reserva cancelada por el administrador';

    constructor(
        private usuariosService: UsuariosService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userId = +this.route.snapshot.paramMap.get('id')!;
        if (this.userId) {
            this.loadReservations();
        } else {
            this.error = 'ID de usuario no válido';
            this.isLoading = false;
        }
    }

    loadReservations(): void {
        this.usuariosService.getUserReservations(this.userId!).subscribe({
            next: (response) => this.reservations = response.reservations,
            error: (err) => this.error = 'Error al cargar las reservas: ' + (err.error?.message || err.message),
            complete: () => this.isLoading = false,
        });
    }

    cancelReservation(reservationId: number): void {
        if (confirm('¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.')) {
            this.isLoading = true;
            this.usuariosService.cancelReservation(this.userId!, reservationId, this.cancellationReason).subscribe({
                next: () => {
                    this.loadReservations();
                    this.error = null;
                },
                error: (err) => this.error = 'Error al cancelar la reserva: ' + (err.error?.message || err.message),
                complete: () => this.isLoading = false,
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/admin/usuarios']);
    }
}