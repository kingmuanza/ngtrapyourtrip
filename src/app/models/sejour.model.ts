import { Modele } from './model.model';
import { Divertissement } from './divertissement.model';
import { Hebergement } from './hebergement.model';
import { Transport } from './transport.model';
import { Depart } from './depart.model';
import { Modification } from './modification.model';

export class Sejour extends Modele {
    public prixUnitaire: number;
    public ville: string;

    public titre: string;
    public description: string;
    public descriptionSuccincte: string;

    public titreENG: string;
    public descriptionENG: string;
    public descriptionSuccincteENG: string;

    public tags: string;
    public images: Array<string>;
    public actif: boolean;
    public notation: number;
    public pack: {
        hebergement: Hebergement,
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

    modification: Modification;

    constructor() {
        super();
        this.options = {
            plage: false,
            montagne: false,
            celebrations: false
        };

        this.pack = {
            hebergement: null,
            transportAller: null,
            transportRetour: null,
            transportInterne: null,
            divertissements: []
        };
    }

}
