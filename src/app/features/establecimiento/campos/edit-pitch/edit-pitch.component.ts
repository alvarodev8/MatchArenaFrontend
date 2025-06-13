import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PitchsService } from '../campos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-pitch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './edit-pitch.component.html',
  styleUrls: ['./edit-pitch.component.scss'],
})
export class EditPitchComponent implements OnInit {
  pitchForm: FormGroup;
  error: string | null = null;
  isLoading: boolean = false;
  pitchId: number;

  constructor(
    private fb: FormBuilder,
    private pitchsService: PitchsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pitchId = +this.route.snapshot.paramMap.get('id')!;
    this.pitchForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.loadPitch();
  }

  loadPitch(): void {
    this.isLoading = true;
    this.pitchsService.getPitch(this.pitchId).subscribe({
      next: (response) => {
        const pitch = response.pitch;
        if (pitch) {
          this.pitchForm.patchValue({
            name: pitch.name,
            location: pitch.location,
            price: pitch.price,
            description: pitch.description || '',
          });
        } else {
          this.error = 'Campo no encontrado';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el campo: ' + (err.error?.message || err.message);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.pitchForm.invalid) return;

    this.isLoading = true;
    this.pitchsService.updatePitch(this.pitchId, this.pitchForm.value).subscribe({
      next: () => this.router.navigate(['/establecimiento/campos']),
      error: (err) => this.error = 'Error al actualizar el campo: ' + (err.error?.message || err.message),
      complete: () => this.isLoading = false,
    });
  }

  cancel(): void {
    this.router.navigate(['/establecimiento/campos']);
  }
}