import { Modele } from './model.model';

export class Hebergement extends Modele {

    titre: string;
    description: string;
    nuitee: number;
    lieu: string;
    tel: string;
    wifi: boolean;
    parking: boolean;
    notation: number;
    images: Array<string>;
    tags: Array<string>;

    constructor() {
        super();
    }

}
