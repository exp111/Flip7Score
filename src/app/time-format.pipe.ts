import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(seconds: number | null) {
    if (seconds == null) {
      return '00:00:00';
    }

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(n: number) {
    return n.toString().padStart(2, '0');
  }
}
