import { Utilisateur } from './utilisateur.model';

export class Prestataire extends Utilisateur {

    nom: string;
    hotel: boolean;
    villa: boolean;
    login: string;
    passe: string;
    logo: string;
    lieu: string;
    tel: string;
    email: string;
    description: string;
    notation: number;
    pays: string;
    ville: string;
    coordonnes: {
        x: number,
        y: number
    };

    constructor(nom?: string) {
        super();
        if (nom) {
            this.nom = nom;
        }
    }
}
