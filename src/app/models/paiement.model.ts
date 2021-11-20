import { Modele } from './model.model';
import { Reservation } from './reservation.model';
import { v4 as uuidv4 } from 'uuid';
import { Utilisateur } from './utilisateur.model';


export class Paiement {
    id: string;
    reservations: Array<Reservation>;
    date: Date;
    total: number;
    mode: string;
    statut: any;
    utilisateur: Utilisateur;
    orangemoney: any;

    constructor() {
        this.id = this.generateID().split('-').join('0');
        this.date = new Date();
    }

    public generateID(): string {
        return uuidv4();
    }
}
