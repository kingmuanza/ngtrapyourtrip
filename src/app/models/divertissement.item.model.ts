import { Divertissement } from './divertissement.model';
import { Modele } from './model.model';

export class DivertissementItem extends Modele {

    divertissement: Divertissement;

    titre: string;
    titreENG: string;
    prix: number;
    description: string;
    descriptionENG: string;
    descriptionSuccincte: string;
    descriptionSuccincteENG: string;
    images: Array<string>;

    constructor(divertissement: Divertissement) {
        super();
        this.divertissement = divertissement;
    }
}
