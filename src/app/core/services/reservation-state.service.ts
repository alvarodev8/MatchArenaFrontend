import { Injectable } from '@angular/core';

interface ReservationData {
    pitch_id: number;
    start_at: string;
    duration: number;
    client_secret?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationStateService {

    private reservationData: ReservationData | null = null;

    setReservationData(data: { pitch_id: number; start_at: string; duration: number; client_secret?: string }) {
        this.reservationData = data;
    }

    getReservationData() {
        return this.reservationData;
    }

    clearReservationData() {
        this.reservationData = null;
    }
}