import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DigitOnlyDirective} from './digit-only';

interface Player {
  editing: boolean;
  deleting: boolean;
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
  players: Player[] = [];
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

  generateColor() {
    const r = Math.floor((Math.random() * 127) + 127);
    const g = Math.floor((Math.random() * 127) + 127);
    const b = Math.floor((Math.random() * 127) + 127);

    return "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");
  }

  addPlayer() {
    this.players.push({
      editing: true,
      deleting: false,
      name: '',
      score: 0,
      color: this.generateColor(),
      roundScores: new Array(this.selectedRound).fill(null)
    });
  }

  startDeletingPlayer(player: Player) {
    player.deleting = true;
  }

  cancelDeletingPlayer(player: Player) {
    player.deleting = false;
  }

  deletePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index >= 0) {
      // delete player
      this.players.splice(index, 1);
    }
  }

  savePlayer(player: Player) {
    // if name empty, remove player
    if (!player.name) {
     this.deletePlayer(player);
    } else {
      player.editing = false;
    }
  }
}
