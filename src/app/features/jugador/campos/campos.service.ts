import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pitch } from '../../../core/models/pitch.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = 'http://localhost:8000/api/pitches';

  constructor(private http: HttpClient) { }

  getPitches(): Observable<Pitch[]> {
    return this.http.get<Pitch[]>(this.apiUrl);
  }
}