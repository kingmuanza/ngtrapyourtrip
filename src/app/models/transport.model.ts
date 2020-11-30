import { Depart } from './depart.model';
import { Modele } from './model.model';

export class Transport extends Modele {

    prixUnitaire: number;
    jours: number;
    description: string;
    notation: number;
    titre: string;
    tags: string;
    images: Array<string>;
    privee: boolean;
    agence: string;
    vip: boolean;
    heureDepart: Date;
    allerRetour: boolean;
    trajetInterne: boolean;
    Trajet: string;

    depart: Depart;
    date: Date;
    personnes: number;
    retour: boolean;
    dateRetour: Date;

    constructor() {
        super();
    }

}
