import { Modele } from './model.model';
import { Utilisateur } from './utilisateur.model';
import * as firebase from 'firebase';
import { Modification } from './modification.model';

export class Hebergement extends Modele {

    titre: string;
    description: string;
    nuitee: number;
    lieu: string;
    tel: string;

    wifi: boolean;
    parking: boolean;

    options: {
        baignoire: boolean,
        wifi: boolean,
        climatiseur: boolean,
        bureau: boolean,
        linge: boolean,
        tele: boolean,
        insonore: boolean,
        bouilloire: boolean,
        cafe: boolean,
        minibar: boolean,
        litsimple: boolean,
        litdouble: boolean,
        spa: boolean,
        forme: boolean,
        navette: boolean,
    };

    notation: number;
    images: Array<string>;
    tags: Array<string>;
    prestataire: Utilisateur;
    pays: string;
    ville: string;
    coordonnes: {
        x: number,
        y: number
    };

    nature: string;
    adultes: number;
    enfants: number;
    modification: Modification;

    constructor(hebergement?: Hebergement) {
        super();
        this.options = {
            baignoire: false,
            wifi: false,
            climatiseur: false,
            bureau: false,
            linge: false,
            tele: false,
            insonore: false,
            bouilloire: false,
            cafe: false,
            minibar: false,
            litsimple: false,
            litdouble: false,
            spa: false,
            forme: false,
            navette: false,
        };

        if (hebergement) {
            this.set(hebergement);
        }
    }

    set(hebergement: Hebergement) {
        /*
        this.images = hebergement.images;
        this.lieu = hebergement.lieu;
        this.nature = hebergement.nature;
        this.notation = hebergement.notation;
        this.nuitee = hebergement.nuitee;
        this.options = hebergement.options;
        this.parking = hebergement.parking;
        this.prestataire = hebergement.prestataire;
        this.tags = hebergement.tags;
        this.tel = hebergement.tel;
        this.wifi = hebergement.wifi;
        this.titre = hebergement.titre;
*/
        const keys = Object.keys(hebergement);

        keys.forEach((key) => {
            this[key] = hebergement[key];
        });

        const db = firebase.firestore();
        db.collection('utilisateurs-trap').doc(this.prestataire.id).get().then((resultat) => {
            this.prestataire = resultat.data() as Utilisateur;
        });
    }

}
