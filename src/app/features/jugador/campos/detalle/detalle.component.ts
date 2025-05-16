import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PitchsService } from '../campos.service';
import { Pitch } from '../../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jugador-campos-detalles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class CampoDetallesComponent implements OnInit {
  pitch: Pitch | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pitchsService: PitchsService
  ) {}

  ngOnInit(): void {
    const pitchId = this.route.snapshot.paramMap.get('id');
    if (pitchId) {
      this.pitchsService.getPitches().subscribe({
        next: (pitches) => {
          this.pitch = pitches.find(p => p.id === +pitchId) || null;
          if (!this.pitch) {
            this.error = 'Campo no encontrado.';
          }
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles del campo: ' + (err.error?.message || err.message);
        }
      });
    }
  }
}