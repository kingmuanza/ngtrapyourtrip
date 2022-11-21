import { Depart } from './depart.model';
import { Gare } from './gare.model';
import { Modele } from './model.model';
import { Modification } from './modification.model';

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
    gare: Gare;
    date: Date;
    personnes: number;
    retour: boolean;
    dateRetour: Date;
    modification: Modification;

    constructor() {
        super();
    }

}
