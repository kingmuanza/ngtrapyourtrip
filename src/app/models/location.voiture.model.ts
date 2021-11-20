import { Modele } from './model.model';
import { Voiture } from './voiture.model';

export class LocationVoiture extends Modele {

    depart = '';
    arrivee = '';
    date: Date;
    dateRetour: Date;
    allerretour = false;

    ville = '';
    debut: Date;
    fin: Date;

    type = '';
    voiture: Voiture;

    constructor(type: string, voiture: Voiture) {
        super();
        this.type = type;
        this.voiture = voiture;
    }

}
