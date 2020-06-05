import { Modele } from './model.model';

export class Divertissement extends Modele {

    titre: string;
    prix: number;
    description: string;
    lieu: string;
    tel: string;
    notation: number;
    tags: string;
    images: Array<string>;

    constructor() {
        super();
    }
}
