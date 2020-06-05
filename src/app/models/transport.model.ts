import { Modele } from './model.model';

export class Transport extends Modele {

    prixUnitaire: number;
    jours: number;
    description: string;
    notation: number;
    titre: string;
    tags: string;
    images: Array<string>;

    constructor() {
        super();
    }

}
