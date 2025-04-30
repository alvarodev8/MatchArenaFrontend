import { Component, OnInit } from '@angular/core';
import { Fixture } from '../../../core/models/fixture.model';
import { PartidosService } from './partidos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jugador-partidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partidos.component.html',
  styleUrl: './partidos.component.scss'
})
export class PartidosComponent implements OnInit {
  fixtures: Fixture[] = [];;
  error: string | null = null;

  constructor(private fixturesService: PartidosService) { }

  ngOnInit(): void {
    this.fixturesService.getFixtures().subscribe({
      next: (fixtures) => this.fixtures = fixtures,
      error: (err) => {
        this.error = 'Error al obtener los partidos: ' + (err.error?.message || err.message);
        console.error('Error al obtener partidos:', err);
      }
    });
  }
}
