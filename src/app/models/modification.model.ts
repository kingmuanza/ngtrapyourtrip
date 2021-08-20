import { v4 as uuidv4 } from 'uuid';
import { Administrateur } from './administrateur.model';

export class Modification {
    id: string;
    date: Date;
    administrateur: Administrateur;

    constructor(administrateur: Administrateur) {
        this.id = this.generateID();
        this.date = new Date();
        this.administrateur = administrateur;
    }

    generateID(): string {
        return uuidv4();
    }
}
