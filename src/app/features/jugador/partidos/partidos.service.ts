import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fixture } from '../../../core/models/fixture.model';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {
  private apiUrl = 'http://localhost:8000/api/fixtures';

  constructor(private http: HttpClient) { }

  getFixtures(): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(this.apiUrl);
  }
}