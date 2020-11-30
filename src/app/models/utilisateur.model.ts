export class Utilisateur {

    id: string;
    uid: string;
    nom: string;
    prenom: string;
    sexe: string;
    login: string;
    photoURL: string;
    prestataire: boolean;
    tel: string;
    email: string;
    description: string;
    pays: string;
    ville: string;
    localisation: string;
    hotel: boolean;
    villa: boolean;
    notation: number;
    prixMin: number;

    options: {
        wifi: boolean,
        plage: boolean,
        piscine: boolean,
        climatiseur: boolean,
        parking: boolean,
        petitdej: boolean,
        gardien: boolean,
    };

    constructor() {

        this.options = {
            wifi: false,
            plage: false,
            piscine: false,
            climatiseur: false,
            parking: false,
            petitdej: false,
            gardien: false,
        };
        this.prixMin = 0;
    }

}
