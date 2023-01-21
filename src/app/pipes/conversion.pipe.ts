import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conversion'
})
export class ConversionPipe implements PipeTransform {

  transform(value: number): number {
    const tauxEUR = 655;
    const tauxUSD = 555;
    const devise = localStorage.getItem('TYTDevise');
    if (devise) {
      if (devise === 'EUR') {
        return (Math.round(100 * value / tauxEUR)) / 100;
      }
      if (devise === 'USD') {
        return (Math.round(100 * value / tauxUSD)) / 100;
      }
    }
    return value;
  }

}
