import { Modele } from './model.model';

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
    images: Array<string>;

    constructor() {
        super();
    }
}
