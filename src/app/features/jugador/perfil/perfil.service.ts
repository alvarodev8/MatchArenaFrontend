import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${environment.apiUrl}/player/profile`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.apiUrl);
  }
}