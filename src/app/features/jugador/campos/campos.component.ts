import { Component, OnInit } from '@angular/core';
import { PitchsService } from './campos.service';
import { Pitch } from '../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-jugador-campos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent],
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.scss']
})
export class CamposComponent implements OnInit {
  pitches$!: Observable<Pitch[]>;
  filteredPitches$!: Observable<Pitch[]>;
  error: string | null = null;
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(private pitchsService: PitchsService) { }

  ngOnInit(): void {
    this.pitches$ = this.pitchsService.pitches$;
    this.filteredPitches$ = this.pitchsService.filteredPitches$;
    this.loadPitches();
  }

  loadPitches(): void {
    this.pitchsService.getPitches().subscribe({
      next: () => this.error = null,
      error: (err) => {
        this.error = 'Error al obtener los campos: ' + (err.error?.message || err.message);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.pitchsService.setSearchTerm(searchTerm);
  }
}
