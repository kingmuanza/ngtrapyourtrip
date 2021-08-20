import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Voiture } from '../models/voiture.model';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  voitures = new Array<Voiture>();
  constructor() {
    const voitures = new Array<Voiture>();
    const voiture = new Voiture('Familliale', 'Peugeot 145');
    voiture.cout = 10000;
    const voiture2 = new Voiture('Sportive', 'Lamborghini', 'Manuelle');
    voiture2.sieges = 2;
    voiture2.portieres = 2;
    voiture2.cout = 270000;
    voiture2.image = '../../../../assets/img/lambo.jpg';
    const voiture3 = new Voiture('SUV', 'Mercedes ML350');
    voiture3.image = '../../../../assets/img/ml.png';
    voiture3.cout = 15000;
    voitures.push(voiture, voiture2, voiture3);
    this.voitures = voitures;
  }

  getVoitures(): Promise<Array<Voiture>> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('voitures-trap').get().then((resultats) => {
        this.voitures = new Array<Voiture>();
        resultats.forEach((resultat) => {
          const voiture = resultat.data() as Voiture;
          this.voitures.push(voiture);
        });
        resolve(this.voitures);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getVoiture(id: string): Promise<Voiture> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      if (id) {
        db.collection('voitures-trap').doc(id).get().then((resultat) => {
          const voiture = resultat.data() as Voiture;
          resolve(voiture);
        }).catch((e) => {
          reject(e);
        });
      } else {
        reject('Il fu tun id');
      }
    });
  }


}
