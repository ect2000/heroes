import { Directive, ElementRef, HostListener, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    const transformed = value.toUpperCase();

    this.renderer.setProperty(this.elementRef.nativeElement, 'value', transformed);

    if (this.ngControl) {
      this.ngControl?.control?.setValue(transformed, {emitModelToViewChange: false});
    }
  }
}
