import { Pitch } from './pitch.model';

export interface Reservation {
    id: number;
    player_id: number,
    start_at: Date,
    duration: number,
    price: number,
    status: string,
    pitch: Pitch;
    payment_status: string,
    payment_method: string,
    cancellation_reason: string | null,
    cancellation_date: Date | null,
}
