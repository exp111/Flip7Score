import {booleanAttribute, Component, computed, input, numberAttribute} from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent {
  value = input.required({transform: numberAttribute});
  max = input.required({transform: numberAttribute});
  showMissing = input(false, {transform: booleanAttribute});

  percent = computed(() =>
    Math.min(100,
      Math.max(0, (this.value() / this.max()) * 100)));
}
