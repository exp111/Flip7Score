import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DigitOnlyDirective} from './digit-only';
import {interval, map, Observable, startWith, Subject, takeUntil} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {TimeFormatPipe} from './time-format.pipe';
import {CircleProgressComponent} from './circle-progress/circle-progress.component';

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
    TimeFormatPipe,
    CircleProgressComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  winningScore = 200;
  selectedRound = 1;
  players: Player[] = [];
  gameActive = false;
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
    if (this.startTime) {
      // if game was restarted reset score
      this.resetScores();
    }
    this.createTimer();
    this.gameActive = true;
  }

  stopGame() {
    this.stopTimer.next();
    this.gameActive = false;
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

  resetScores() {
    this.selectedRound = 1;
    for (let player of this.players) {
      player.score = 0;
      player.roundScores.fill(null);
    }
  }

  pad(n: number) {
    return n.toString().padStart(2, "0");
  }

  generateExportData() {
    if (!this.startTime) {
      return;
    }
    // calculate rank according to score. ties take the first occurrence (as its sorted, the first place of the tie)
    let ranked = this.players.map(p => p.score).sort((a, b) => b - a);
    let date = new Date(this.startTime);
    return {
      "board": "",
      "durationMin": Math.floor((Date.now() - this.startTime) / 1000 / 60),
      "comments": "",
      "game": {
        "bggId": 420087,
        "highestWins": true,
        "name": "Flip 7",
        "noPoints": false,
        "sourceGameId": "FLIP7"
      },
      "location": "Home",
      "playDate": `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())} ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`,
      "players": this.players.map(p => ({
        "startPlayer": false,
        "name": p.name,
        "rank": ranked.indexOf(p.score) + 1,
        "role": "",
        "score": p.score,
        "sourcePlayerId": p.name,
        "winner": ranked[0] == p.score
      })),
      "sourceName": "Flip 7 Score",
      "sourcePlayId": this.startTime!.toString()
    };
  }

  exportPlay() {
    let data = this.generateExportData();
    window.open(`bgstats://app.bgstatsapp.com/createPlay.html?data=${JSON.stringify(data)}`)
  }
}
