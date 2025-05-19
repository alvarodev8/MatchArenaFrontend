import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Pitch } from '../../../core/models/pitch.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = `${environment.apiUrl}/player/pitches`;

  constructor(private http: HttpClient) { }

  getPitches(): Observable<Pitch[]> {
    return this.http.get<Pitch[]>(this.apiUrl);
  }

  filterPitches(pitches: Pitch[], search: string = ''): Pitch[] {
    if (!search.trim()) {
      return pitches;
    }

    const searchLower = search.toLowerCase();
    return pitches.filter(pitch =>
      (pitch.name?.toLowerCase()?.includes(searchLower) || false) ||
      (pitch.location?.toLowerCase()?.includes(searchLower) || false)
    );
  }
}