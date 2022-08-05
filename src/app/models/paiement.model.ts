import { Modele } from './model.model';
import { Reservation } from './reservation.model';
import { v1 as uuidv1 } from 'uuid';
import { Utilisateur } from './utilisateur.model';


export class Paiement {
    id: string;
    reservations: Array<Reservation>;
    date: Date;
    total: number;
    mode: string;
    statut: number;
    utilisateur: Utilisateur;
    orangemoney: any;
    info: any;

    constructor() {
        this.id = this.generateID().split('-').join('0');
        this.date = new Date();
    }

    public generateID(): string {
        return uuidv1();
    }
}
