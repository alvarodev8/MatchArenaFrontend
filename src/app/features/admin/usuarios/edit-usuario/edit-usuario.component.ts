import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { User, UpdateUserData } from '../../../../core/models/user.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
    selector: 'app-edit-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    templateUrl: './edit-usuario.component.html',
    styleUrls: ['./edit-usuario.component.scss']
})
export class EditUsuarioComponent implements OnInit {
    user: User | null = null;
    error: string | null = null;
    isLoading: boolean = true;
    formData: UpdateUserData = {};

    constructor(
        private usuariosService: UsuariosService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('id')!;
        this.usuariosService.getUsuario(id).subscribe({
            next: (response) => {
                this.user = response.user;
                this.formData = { ...this.user };
            },
            error: (err) => this.error = 'Error al cargar el usuario: ' + (err.error?.message || err.message),
            complete: () => this.isLoading = false,
        });
    }

    onSubmit(): void {
        if (!this.user) return;

        this.isLoading = true;
        this.usuariosService.updateUsuario(this.user.id, this.formData).subscribe({
            next: () => this.router.navigate(['/admin/usuarios']),
            error: (err) => this.error = 'Error al actualizar el usuario: ' + (err.error?.message || err.message),
            complete: () => this.isLoading = false,
        });
    }

    cancel(): void {
        this.router.navigate(['/admin/usuarios']);
    }
}