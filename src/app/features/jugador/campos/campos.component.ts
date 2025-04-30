import { Component, OnInit } from '@angular/core';
import { CamposService } from './../../establecimiento/campos/campos.service';
import { Pitch } from '../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jugador-campos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campos.component.html',
  styleUrl: './campos.component.scss'
})
export class CamposComponent implements OnInit {
  pitches: Pitch[] = [];
  error: string | null = null;

  constructor(private pitchesService: CamposService) { }

  ngOnInit(): void {
    this.pitchesService.getCampos().subscribe({
      next: (pitches) => this.pitches = pitches,
      error: (err) => {
        this.error = 'Error al obtener los campos: ' + (err.error?.message || err.message);
        console.error('Error al obtener campos:', err);
      }
    });
  }
}
