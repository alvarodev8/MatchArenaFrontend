import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PitchesResponse, PitchResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = `${environment.apiUrl}/establishment/pitches`;

  constructor(private http: HttpClient) { }

  getPitches(): Observable<PitchesResponse> {
    return this.http.get<PitchesResponse>(this.apiUrl);
  }

  getPitchesForEstablishment(): Observable<PitchesResponse> {
    return this.http.get<PitchesResponse>(this.apiUrl);
  }

  getPitch(id: number): Observable<PitchResponse> {
    return this.http.get<PitchResponse>(`${this.apiUrl}/${id}`);
  }

  createPitch(pitch: { name: string; location: string; price: number; description?: string }): Observable<PitchResponse> {
    return this.http.post<PitchResponse>(this.apiUrl, pitch);
  }

  updatePitch(id: number, pitch: { name: string; location: string; price: number; description?: string }): Observable<PitchResponse> {
    return this.http.put<PitchResponse>(`${this.apiUrl}/${id}`, pitch);
  }

  deletePitch(id: number): Observable<PitchResponse> {
    return this.http.delete<PitchResponse>(`${this.apiUrl}/${id}`);
  }
}