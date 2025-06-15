import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UsersResponse } from '../../../core/models/api-response.model';
import { User, UpdateUserData, RegisterData } from '../../../core/models/user.model';
import { Reservation } from '../../../core/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl);
  }

  getUsuario(id: number): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/${id}`);
  }

  createUsuario(data: RegisterData): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(this.apiUrl, data);
  }

  updateUsuario(id: number, data: UpdateUserData): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/${id}`, data);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getUserReservations(userId: number): Observable<{ reservations: Reservation[] }> {
    return this.http.get<{ reservations: Reservation[] }>(`${this.apiUrl}/${userId}/reservations`);
  }

  cancelReservation(userId: number, reservationId: number, cancellationReason: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { cancellation_reason: cancellationReason };
    return this.http.delete<any>(`${this.apiUrl}/${userId}/reservations/${reservationId}`, { headers, body });
  }
}