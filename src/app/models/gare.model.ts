
import { v4 as uuidv4 } from 'uuid';
import { Agence } from './agence.model';

export class Gare {
    id: string;
    nom: string;
    ville: string;
    lieu: string;
    agence: Agence;
    images = [];

    constructor() {
        this.id = this.generateID();
    }

    generateID(): string {
        return uuidv4();
    }
}
