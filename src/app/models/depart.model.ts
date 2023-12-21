import { Trajet } from './trajet.model';
import { Agence } from './agence.model';
import { v4 as uuidv4 } from 'uuid';
import { Modification } from './modification.model';

export class Depart {

    id: string;
    trajet: Trajet;
    agence: Agence;
    modele: string;
    heures: Array<Date>;
    prix: number;
    vip: boolean;
    modification: Modification;
    prixAR: number;

    constructor() {
        this.id = this.generateID();
    }

    generateID(): string {
        return uuidv4();
    }
}
