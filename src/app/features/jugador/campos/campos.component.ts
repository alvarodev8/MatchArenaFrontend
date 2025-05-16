import { Component, OnInit } from '@angular/core';
import { PitchsService } from './campos.service';
import { Pitch } from '../../../core/models/pitch.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-jugador-campos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './campos.component.html',
  styleUrls: ['./campos.component.scss']
})
export class CamposComponent implements OnInit {
  pitches: Pitch[] = [];
  filteredPitches: Pitch[] = [];
  error: string | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(private pitchsService: PitchsService) { }

  ngOnInit(): void {
    this.loadPitches();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filteredPitches = this.pitchsService.filterPitches(this.pitches, searchTerm);
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  loadPitches(): void {
    this.loading = true;
    this.pitchsService.getPitches().subscribe({
      next: (pitches) => {
        this.pitches = pitches;
        this.filteredPitches = pitches;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener los campos: ' + (err.error?.message || err.message);
        this.loading = false;
        console.error('Error al obtener campos:', err);
      }
    });
  }
}
