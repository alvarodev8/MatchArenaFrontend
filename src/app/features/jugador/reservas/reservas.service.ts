import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Reservation } from '../../../core/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = `${environment.apiUrl}/player/reservations`;

  constructor(private http: HttpClient) { }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  createReservation(reservation: { pitch_id: number, start_at: string, duration: number }): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  checkAvailability(reservation: { pitch_id: number, start_at: string, duration: number }): Observable<{ available: boolean, message?: string }> {
    return this.http.post<{ available: boolean, message?: string }>(`${this.apiUrl}/check`, reservation);
  }

  getAvailableTimes(pitchId: number, date: string): Observable<{ availableTimes: string[] }> {
    return this.http.get<{ availableTimes: string[] }>(`${this.apiUrl}/available-times`, {
      params: { pitch_id: pitchId.toString(), date }
    });
  }

  getAvailableDates(pitchId: number, startDate: string, endDate: string): Observable<{ date: string, available: boolean }[]> {
    return this.http.get<{ date: string, available: boolean }[]>(`${this.apiUrl}/available-dates`, {
      params: { pitch_id: pitchId.toString(), start_date: startDate, end_date: endDate }
    });
  }
}