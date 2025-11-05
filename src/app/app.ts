import {Component} from '@angular/core';

interface Player {
  name: string;
  score: number;
  color: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  players: Player[] = [
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
