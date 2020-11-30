import { Modele } from './model.model';
import { Divertissement } from './divertissement.model';
import { Hebergement } from './hebergement.model';
import { Transport } from './transport.model';
import { Depart } from './depart.model';

export class Sejour extends Modele {
    public prixUnitaire: number;
    public ville: string;
    public description: string;
    public tags: string;
    public titre: string;
    public images: Array<string>;
    public actif: boolean;
    public notation: number;
    public pack: {
        hebergements: Array<Hebergement>,
        transportAller: Depart,
        transportRetour: Depart,
        transportInterne: Depart,
        divertissements: Array<Divertissement>
    };
    public options: {
        plage: boolean,
        montagne: boolean,
        celebrations: boolean
    };
    dateDebut: Date;
    dateFin: Date;

    constructor() {
        super();
        this.options = {
            plage: false,
            montagne: false,
            celebrations: false
        };
    }

}
