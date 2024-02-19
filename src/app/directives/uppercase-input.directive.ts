import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {

  constructor(private element: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    this.element.nativeElement.value = this.element.nativeElement.value.toUpperCase();
  }
}
