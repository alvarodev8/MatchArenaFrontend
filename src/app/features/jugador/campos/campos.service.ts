import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Pitch } from '../../../core/models/pitch.model';
import { PitchesResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PitchsService {
  private apiUrl = `${environment.apiUrl}/player/pitches`;
  private pitchesSubject = new BehaviorSubject<Pitch[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');

  pitches$ = this.pitchesSubject.asObservable();
  filteredPitches$ = combineLatest([this.pitches$, this.searchTermSubject]).pipe(
    debounceTime(300), // Retrasa la emisión 300ms para evitar actualizaciones excesivas
    distinctUntilChanged(), // Evita emisiones si no hay cambios en los datos
    map(([pitches, search]) => this.filterPitches(pitches, search)) // Aplica el filtrado
  );

  constructor(private http: HttpClient) { }

  getPitches(): Observable<PitchesResponse> {
    return this.http.get<PitchesResponse>(this.apiUrl).pipe(
      tap(response => this.pitchesSubject.next(response.pitches)) // Actualiza el subject con los datos obtenidos
    );
  }

  setSearchTerm(search: string): void {
    this.searchTermSubject.next(search); // Emite el nuevo término de búsqueda
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