import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conversion'
})
export class ConversionPipe implements PipeTransform {

  transform(value: number): number {
    const devise = localStorage.getItem('TYTDevise');
    if (devise) {
      if (devise === 'EUR') {
        return (Math.round(100 * value / 655)) / 100;
      }
    }
    return value;
  }

}
