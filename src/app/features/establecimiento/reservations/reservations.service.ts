import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReservationsResponse } from '../../../core/models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {
    private apiUrl = `${environment.apiUrl}/establishment/reservations`;

    constructor(private http: HttpClient) { }

    getReservations(): Observable<ReservationsResponse> {
        return this.http.get<ReservationsResponse>(this.apiUrl);
    }

    cancelReservation(id: number, cancellation_reason: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { cancellation_reason };
        return this.http.delete(`${this.apiUrl}/${id}`, { headers, body });
    }
}