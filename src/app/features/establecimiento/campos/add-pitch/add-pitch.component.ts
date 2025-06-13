import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PitchsService } from '../campos.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-add-pitch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './add-pitch.component.html',
  styleUrls: ['./add-pitch.component.scss'],
})
export class AddPitchComponent implements OnInit {
  pitchForm: FormGroup;
  error: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pitchsService: PitchsService,
    private router: Router
  ) {
    this.pitchForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.pitchForm.invalid) return;

    this.isLoading = true;
    this.pitchsService.createPitch(this.pitchForm.value).subscribe({
      next: () => this.router.navigate(['/establecimiento/campos']),
      error: (err) => this.error = 'Error al crear el campo: ' + (err.error?.message || err.message),
      complete: () => this.isLoading = false
    });
  }

  cancel(): void {
    this.router.navigate(['/establecimiento/campos']);
  }
}