import { Trajet } from './trajet.model';
import { v4 as uuidv4 } from 'uuid';
import { Modification } from './modification.model';

export class Agence {
    id: string;
    nom: string;
    bus: boolean;
    modification: Modification;

    constructor() {
        this.id = this.generateID();
    }

    generateID(): string {
        return uuidv4();
    }
}
