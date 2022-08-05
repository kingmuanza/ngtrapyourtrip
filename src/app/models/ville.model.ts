import { v4 as uuidv4 } from 'uuid';

export class Ville {
    id: string;
    nom: string;
    pays: string;

    constructor(nom: string, pays: string) {
        this.id = nom + '-' + pays;
        this.nom = nom;
        this.pays = pays;
    }

    generateID(): string {
        return uuidv4();
    }
}
