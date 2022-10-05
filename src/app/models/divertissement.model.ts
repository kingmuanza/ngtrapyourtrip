import { Modele } from './model.model';
import { Modification } from './modification.model';

export class Divertissement extends Modele {

    titre: string;
    prix: number;
    description: string;
    lieu: string;
    ville: string;
    tel: string;
    notation: number;
    tags: string;
    date: Date;
    dateFin: Date;
    images: Array<string>;
    restaurant: boolean;
    modification: Modification;
    latitude = 0;
    longitude = 0;

    constructor() {
        super();
    }
}
