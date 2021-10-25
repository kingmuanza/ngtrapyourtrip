import { v4 as uuidv4 } from 'uuid';

export class Voiture {
    id: string;
    categorie = '';
    modele = '';
    transmission = 'Automatique';
    coutInterurbain = 0;
    cout = 10000;
    sieges = 5;
    portieres = 4;
    image = '../../../../assets/img/voiture.webp';

    constructor(categorie, modele, transmission?) {
        if (categorie) {
            this.categorie = categorie;
        }
        if (modele) {
            this.modele = modele;
        }
        if (transmission) {
            this.transmission = transmission;
        }
        this.id = uuidv4();
    }
}
