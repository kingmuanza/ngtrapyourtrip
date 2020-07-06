import { Modele } from './model.model';

export class Prestataire extends Modele {

    nom: string;

    hotel: boolean;
    villa: boolean;

    constructor() {
        super();
    }
}
