import { Trajet } from './trajet.model';
import { v4 as uuidv4 } from 'uuid';

export class Agence {
    id: string;
    nom: string;
    bus: boolean;

    constructor() {
        this.id = this.generateID();
    }

    generateID(): string {
        return uuidv4();
    }
}
