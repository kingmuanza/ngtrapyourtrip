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
    images = new Array<string>();
    restaurant: boolean;
    modification: Modification;

    constructor() {
        super();
        this.prix = 0;
    }
}
