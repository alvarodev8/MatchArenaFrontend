import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Pitch } from '../../../core/models/pitch.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = `${environment.apiUrl}/pitches`;

  constructor(private http: HttpClient) { }

  getPitches(): Observable<Pitch[]> {
    return this.http.get<Pitch[]>(this.apiUrl);
  }
}