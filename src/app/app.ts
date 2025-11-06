import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DigitOnlyDirective} from './digit-only';
import {interval, map, Observable, startWith, Subject, takeUntil} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TimeFormatPipe} from './time-format.pipe';

interface Player {
  editing: boolean;
  name: string;
  score: number;
  color: string;
  roundScores: (number | null)[];
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    DigitOnlyDirective,
    AsyncPipe,
    TimeFormatPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  winningScore = 200;
  selectedRound = 1;
  players: Player[] = [];
  startTime: number | null = null;
  stopTimer = new Subject<void>();
  elapsedTime?: Observable<number>;
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
    player.score = player.roundScores.reduce((a, b) => (a ?? 0) + (b ?? 0))!;
  }

  startGame() {
    this.createTimer();
  }

  stopGame() {
    this.stopTimer.next();
  }

  createTimer() {
    this.startTime = Date.now();
    this.elapsedTime = interval(100).pipe( // update every 100 ms
      startWith(0),
      takeUntil(this.stopTimer),
      map(() => (Date.now() - this.startTime!) / 1000)
    );
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
      name: '',
      score: 0,
      color: this.generateColor(),
      roundScores: new Array(this.selectedRound).fill(null)
    });
  }

  editPlayer(player: Player) {
    player.editing = true;
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
