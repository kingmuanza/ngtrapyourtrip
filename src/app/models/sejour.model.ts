import { Modele } from './model.model';

export class Sejour extends Modele {
    public prixUnitaire: number;
    public ville: string;
    public description: string;
    public tags: string;
    public titre: string;
    public images: Array<string>;
    public actif: boolean;
    public notation: number;

    constructor() {
        super();
    }

}
