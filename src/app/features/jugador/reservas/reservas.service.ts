import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  ReservationsResponse, ReservationResponse, AvailabilityResponse, AvailableTimesResponse,
  AvailableDatesResponse, CreatePaymentIntentResponse
} from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = `${environment.apiUrl}/player/reservations`;

  constructor(private http: HttpClient) { }

  getReservations(): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(this.apiUrl);
  }

  createReservation(reservation: { pitch_id: number; start_at: string; duration: number }): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(this.apiUrl, reservation);
  }

  checkAvailability(reservation: { pitch_id: number; start_at: string; duration: number }): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(`${this.apiUrl}/check`, reservation);
  }

  getAvailableTimes(pitchId: number, date: string): Observable<AvailableTimesResponse> {
    return this.http.get<AvailableTimesResponse>(`${this.apiUrl}/available-times`, {
      params: { pitch_id: pitchId.toString(), date }
    });
  }

  getAvailableDates(pitchId: number, startDate: string, endDate: string): Observable<AvailableDatesResponse> {
    return this.http.get<AvailableDatesResponse>(`${this.apiUrl}/available-dates`, {
      params: { pitch_id: pitchId.toString(), start_date: startDate, end_date: endDate }
    });
  }

  createPaymentIntent(data: { pitch_id: number; start_at: string; duration: number }): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(`${this.apiUrl}/create-payment-intent`, data);
  }

  modifyReservation(id: number, data: { start_at: string; duration: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/modify`, data);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}