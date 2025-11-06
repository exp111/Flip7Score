import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent {
  @Input() value = 0;
  @Input() max = 120;
  @Input() showMissing = false;

  get percent() {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }
}
