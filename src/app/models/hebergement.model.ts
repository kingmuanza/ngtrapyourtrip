import { Modele } from './model.model';
import { Prestataire } from './prestataire.model';

export class Hebergement extends Modele {

    titre: string;
    description: string;
    nuitee: number;
    lieu: string;
    tel: string;

    wifi: boolean;
    parking: boolean;

    options: {
        wifi: boolean,
        plage: boolean,
        piscine: boolean,
        climatiseur: boolean,
        parking: boolean,
        petitdej: boolean,
        gardien: boolean,
    };

    notation: number;
    images: Array<string>;
    tags: Array<string>;
    prestataire: Prestataire;

    nature: string;
    adultes: number;
    enfants: number;

    constructor() {
        super();
        this.options = {
            wifi: false,
            plage: false,
            piscine: false,
            climatiseur: false,
            parking: false,
            petitdej: false,
            gardien: false,
        };
    }

}
