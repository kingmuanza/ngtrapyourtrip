import { Modele } from './model.model';
import { Sejour } from './sejour.model';
import { Utilisateur } from './utilisateur.model';
import { Hebergement } from './hebergement.model';
import { Divertissement } from './divertissement.model';
import { Transport } from './transport.model';

export class Reservation extends Modele {

    sejour?: Sejour;
    divertissement?: Divertissement;
    hebergement?: Hebergement;
    transport?: Transport;

    cout: number;
    dateDebut: Date;
    dateFin?: Date;
    personnes: number;
    enfants: number;
    paiements: Array<{
        montant: number;
        date: Date;
        mode: string;
    }>;
    validee: boolean;
    effectuee: boolean;
    responsable: {
        nom: string,
        prenom: string,
        tel: string,
        numero: string,
    };

    utilisateur: Utilisateur;

    constructor() {
        super();
        this.enfants = 0;
    }

}
