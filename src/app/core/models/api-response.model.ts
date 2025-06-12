import { User } from "./user.model";
import { Pitch } from "./pitch.model";
import { Reservation } from "./reservation.model";

export interface UsersResponse {
    message: string;
    users: User[];
}

export interface UserResponse {
    message: string;
    user: User;
}

export interface PitchesResponse {
    message: string;
    pitches: Pitch[];
}

export interface ReservationsResponse {
    message: string;
    reservations: Reservation[];
}

export interface ReservationResponse {
    message: string;
    reservation: Reservation;
}

export interface AvailableDatesResponse {
    message: string;
    dates: { date: string; available: boolean }[];
}

export interface AvailableTimesResponse {
    message: string;
    availableTimes: string[];
}

export interface AvailabilityResponse {
    message?: string;
    available: boolean;
}

export interface CreatePaymentIntentResponse {
    message?: string;
    client_secret: string;
}
