import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UsersResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/admin/users`

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl);
  }
}