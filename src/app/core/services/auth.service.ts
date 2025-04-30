import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUser: User | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<{ user: User, token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => response.user),
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo más tarde.';
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
        } else if (error.status === 422) {
          const errors = error.error.errors;
          errorMessage = Object.values(errors).flat().join(' ');
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<{ user: User, token: string }>(`${this.apiUrl}/register`, data).pipe(
      map(response => response.user),
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al registrarse. Inténtalo de nuevo más tarde.';
        if (error.status === 422) {
          const errors = error.error.errors;
          errorMessage = Object.values(errors).flat().join(' ');
        } else if (error.status === 409) {
          errorMessage = 'El email ya está registrado. Usa otro email.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al enviar el enlace de recuperación. Inténtalo de nuevo más tarde.';
        if (error.status === 400) {
          errorMessage = 'No se pudo enviar el enlace de recuperación. Verifica el email.';
        } else if (error.status === 422) {
          const errors = error.error.errors;
          errorMessage = Object.values(errors).flat().join(' ');
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  resetPassword(data: { token: string, email: string, password: string, password_confirmation: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al restablecer la contraseña. Inténtalo de nuevo más tarde.';
        if (error.status === 400) {
          errorMessage = 'No se pudo restablecer la contraseña. El enlace puede haber expirado.';
        } else if (error.status === 422) {
          const errors = error.error.errors;
          errorMessage = Object.values(errors).flat().join(' ');
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('user');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}