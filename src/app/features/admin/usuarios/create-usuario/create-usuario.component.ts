import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { RegisterData } from '../../../../core/models/user.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
    selector: 'app-create-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    templateUrl: './create-usuario.component.html',
    styleUrls: ['./create-usuario.component.scss']
})
export class CreateUsuarioComponent {
    error: string | null = null;
    isLoading: boolean = false;
    formData: RegisterData = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'player'
    };

    constructor(private usuariosService: UsuariosService, private router: Router) { }

    onSubmit(): void {
        this.isLoading = true;
        this.usuariosService.createUsuario(this.formData).subscribe({
            next: () => this.router.navigate(['/admin/usuarios']),
            error: (err) => this.error = 'Error al crear el usuario: ' + (err.error?.message || err.message),
            complete: () => this.isLoading = false,
        });
    }

    cancel(): void {
        this.router.navigate(['/admin/usuarios']);
    }
}