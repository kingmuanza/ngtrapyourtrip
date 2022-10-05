import { Divertissement } from './divertissement.model';
import { Modele } from './model.model';

export class DivertissementItem extends Modele {

    divertissement: Divertissement;

    titre: string;
    prix: number;
    description: string;
    images: Array<string>;

    constructor(divertissement: Divertissement) {
        super();
        this.divertissement = divertissement;
    }
}
