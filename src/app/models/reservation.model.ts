import { Modele } from './model.model';
import { Sejour } from './sejour.model';
import { Utilisateur } from './utilisateur.model';
import { Hebergement } from './hebergement.model';
import { Divertissement } from './divertissement.model';
import { Transport } from './transport.model';
import { LocationVoiture } from './location.voiture.model';
import { DivertissementItem } from './divertissement.item.model';

export class Reservation extends Modele {

    sejour?: Sejour;
    divertissement?: Divertissement;
    divertissementItem?: DivertissementItem;
    hebergement?: Hebergement;
    transport?: Transport;
    locationVoiture?: LocationVoiture;

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
        email: string,
        numero: string,
        indicatif: string,
        typepiece: string
    };

    utilisateur: Utilisateur;
    statut: string;

    payee = false;

    constructor() {
        super();
        this.enfants = 0;
    }

}
