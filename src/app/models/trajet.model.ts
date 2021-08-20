import { v4 as uuidv4 } from 'uuid';
import { Modification } from './modification.model';

export class Trajet {
    id: string;
    villeDepart: string;
    villeArrivee: string;
    interUrbain: boolean;
    duree: string;
    modification: Modification;

    constructor() {
        this.id = this.generateID();
    }

    generateID(): string {
        return uuidv4();
    }
}
