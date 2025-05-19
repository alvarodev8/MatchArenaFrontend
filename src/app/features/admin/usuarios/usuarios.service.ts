import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/admin/users`

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}