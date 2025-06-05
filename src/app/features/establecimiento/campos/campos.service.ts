import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PitchesResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = `${environment.apiUrl}/establishment/pitches`;

  constructor(private http: HttpClient) { }

  getPitches(): Observable<PitchesResponse> {
    return this.http.get<PitchesResponse>(this.apiUrl);
  }
}