import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DigitOnlyDirective} from './digit-only';

interface Player {
  name: string;
  score: number;
  color: string;
  roundScores: (number|null)[];
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    DigitOnlyDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  winningScore = 200;
  selectedRound = 1;
  players: Player[] = [
    {
      name: "Jane",
      score: 160,
      color: "#9183A5",
      roundScores: [null]
    },
    {
      name: "Tim",
      score: 60,
      color: "#585A65",
      roundScores: [null]
    }
  ];
  // show total/missing score
  showMissingScore = false;

  constructor() {
    (window as any).app = this;
  }

  changeScoreDisplay() {
    this.showMissingScore = !this.showMissingScore;
  }

  changeRound(diff: number) {
    // dont allow under 1
    if (this.selectedRound + diff < 1) {
      return;
    }
    this.selectedRound += diff;
    this.fillScores();
  }

  // assert that the scores arrays are filled up
  fillScores() {
    for (let player of this.players) {
      // fill up
      while (player.roundScores.length < this.selectedRound) {
        player.roundScores.push(null);
      }
    }
  }

  // refreshes the total score by counting up the single round scores
  updateScore(player: Player) {
    player.score = player.roundScores.reduce((a,b) => (a ?? 0) + (b ?? 0))!;
  }
}
