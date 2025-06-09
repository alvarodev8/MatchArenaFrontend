import { Component, OnInit } from '@angular/core';
import { PitchsService } from './../../establecimiento/campos/campos.service';
import { Pitch } from '../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

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
  
  constructor(private pitchesService: PitchsService) { }
  
  ngOnInit(): void {
    this.pitchesService.getPitches().subscribe({
      next: (response) => this.pitches = response.pitches,
      error: (err) => {
        this.error = 'Error al obtener los campos: ' + (err.error?.message || err.message);
        console.error('Error al obtener campos:', err);
      },
      complete: () => this.isLoading = false,
    });
  }
}
