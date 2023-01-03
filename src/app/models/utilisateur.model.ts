import { Modification } from './modification.model';

export class Utilisateur {

    id: string;
    uid: string;
    nom: string;
    prenom: string;
    displayName: string;
    sexe: string;
    login: string;
    photoURL: string;
    prestataire: boolean;
    tel: string;
    email: string;
    description: string;
    descriptionENG: string;
    pays: string;
    ville: string;
    localisation: string;
    hotel: boolean;
    villa: boolean;
    lodge: boolean;
    notation: number;
    prixMin: number;

    latitude = 0;
    longitude = 0;

    options: {
        piscine: boolean,
        plage: boolean,
        spa: boolean,
        petitdej: boolean,
        dej: boolean,
        cuisine: boolean,
    };
    modification: Modification;
    indisponible = false;

    constructor() {

        this.options = {
            piscine: false,
            plage: false,
            spa: false,
            petitdej: false,
            dej: false,
            cuisine: false,
        };
        this.prixMin = 0;
    }

}
