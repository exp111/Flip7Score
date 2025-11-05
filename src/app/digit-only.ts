import {Directive, HostListener, input, numberAttribute} from '@angular/core';

@Directive({
  selector: 'input[digitOnly]'
})
export class DigitOnlyDirective {
  maxLength = input(-1, {
    transform: numberAttribute
  });

  private regex: RegExp = new RegExp(/^[0-9]$/); // einzelne Ziffer
  private specialKeys: string[] = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
  private controlCombos: string[] = ['a', 'c', 'v', 'x'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    const input = event.target as HTMLInputElement;

    // allow special keys
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    // allow control combos (ie ctrl + a)
    if ((event.ctrlKey || event.metaKey) && this.controlCombos.includes(event.key.toLowerCase())) {
      return;
    }

    // block non numbers
    if (!this.regex.test(event.key)) {
      event.preventDefault();
      return;
    }

    // block if longer than maxlength
    if (this.maxLength() > 0 && input.value.length >= this.maxLength()) {
      event.preventDefault();
    }
  }
}
