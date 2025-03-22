import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSepareted'
})
export class CamelCaseToSeparetedPipe implements PipeTransform {

  transform(value: string, separator: string = ' '): string {
    if (!value) {
      return '';
    }
    return value.replace(/([A-Z])/g, `${separator}$1`).trim();
  }

}
