import { Component, OnInit } from '@angular/core';
import { PitchsService } from './campos.service';
import { Pitch } from '../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establecimiento-campos',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './campos.component.html',
  styleUrl: './campos.component.scss'
})
export class CamposComponent implements OnInit {
  pitches: Pitch[] = [];
  error: string | null = null;
  isLoading: boolean = true;

  constructor(
    private pitchsService: PitchsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPitches();
  }

  loadPitches(): void {
    this.isLoading = true;
    this.pitchsService.getPitchesForEstablishment().subscribe({
      next: (response) => this.pitches = response.pitches,
      error: (err) => this.error = 'Error al obtener los campos: ' + (err.error?.message || err.message),
      complete: () => this.isLoading = false
    });
  }

  addPitch(): void {
    this.router.navigate(['establecimiento/campos/add']);
  }

  editPitch(id: number): void {
    this.router.navigate([`establecimiento/campos/edit/${id}`]);
  }

  deletePitch(id: number): void {
    if (confirm('¿Estás seguro de que deseas marcar este campo como eliminado?')) {
      this.isLoading = true;
      this.pitchsService.deletePitch(id).subscribe({
        next: () => this.loadPitches(),
        error: (err) => this.error = 'Error al eliminar el campo: ' + (err.error?.message || err.message),
        complete: () => this.isLoading = false
      });
    }
  }
}