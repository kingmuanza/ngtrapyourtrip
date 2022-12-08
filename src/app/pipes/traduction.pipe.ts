import { Pipe, PipeTransform } from '@angular/core';
import { LangueAnglaise } from '../data/langue.anglais';

@Pipe({
  name: 'traduction'
})
export class TraductionPipe implements PipeTransform {

  language = LangueAnglaise;

  transform(value: string, langue?: string): unknown {

    const l = localStorage.getItem('TYTLangue');
    if (l) {
      langue = l;
    }
    if (langue) {
      if (langue === 'FR') {
        return value;
      } else {
        console.log('value');
        console.log(value);
        console.log('language[value]');
        console.log(this.language[value]);
        console.log(this.language.Accueil);
        if (this.language[value]) {
          return this.language[value];
        } else {
          return value;
        }
      }
    } else {
      return value;
    }
  }

}
