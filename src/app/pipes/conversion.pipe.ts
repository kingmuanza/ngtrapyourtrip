import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conversion'
})
export class ConversionPipe implements PipeTransform {

  transform(value: number): number {
    let tauxEUR = 655;
    let tauxUSD = 555;
    const tauxString = localStorage.getItem('TYTTaux');
    if (tauxString) {
      const taux = JSON.parse(tauxString);
      tauxEUR = taux.eur;
      tauxUSD = taux.usd;
    }
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
