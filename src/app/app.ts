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
  selectedRound = 1;
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

  changeRound(diff: number) {
    // dont allow under 1
    if (this.selectedRound + diff < 1) {
      return;
    }
    this.selectedRound += diff;
  }
}
