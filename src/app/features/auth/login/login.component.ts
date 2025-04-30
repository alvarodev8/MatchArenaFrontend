import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginCredentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: (user) => {
        if (user.role === 'player') {
          this.router.navigate(['/jugador/perfil']);
        } else if (user.role === 'establishment') {
          this.router.navigate(['/establecimiento/campos']);
        } else if (user.role === 'admin') {
          this.router.navigate(['/admin/usuarios']);
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}