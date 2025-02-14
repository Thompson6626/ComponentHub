import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'Base64ToText'
})
export class Base64ToTextPipe implements PipeTransform {

  private domSanitizer = inject(DomSanitizer);

  transform(encodedSring: string | null, asHtml: boolean = false): string | SafeHtml {
    const decodedText = encodedSring ? atob(encodedSring) : '';

    return asHtml ? this.domSanitizer.bypassSecurityTrustHtml(decodedText) : decodedText;
  }
}


