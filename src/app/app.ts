import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Player {
  name: string;
  score: number;
  color: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  players = [
    {
      name: "Jane",
      score: 160,
      color: "#9183A5"
    },
    {
      name: "Tim",
      score: 60,
      color: "#585A65"
    }
  ];
}
