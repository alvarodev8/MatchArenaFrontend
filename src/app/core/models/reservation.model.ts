import { Pitch } from './pitch.model';

export interface Reservation {
    id: number;
    player: { id: number; name: string, email: string };
    start_at: Date,
    duration: number,
    price: number,
    status: string,
    pitch: Pitch;
    payment_status: string,
    payment_method: string,
    cancellation_reason: string | null,
    cancellation_date: Date | null,
    deleted_at?: Date;
}
