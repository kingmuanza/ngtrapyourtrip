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
    paiements: Array<{
        montant: number;
        date: Date;
        mode: string;
    }>;

    utilisateur: Utilisateur;

    constructor() {
        super();
    }

}
