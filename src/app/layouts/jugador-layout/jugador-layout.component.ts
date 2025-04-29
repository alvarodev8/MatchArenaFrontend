import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layouts-jugador',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './jugador-layout.component.html',
  styleUrl: './jugador-layout.component.scss'
})
export class JugadorLayoutComponent {

}
