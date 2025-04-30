import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8000/api/profile';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }
}