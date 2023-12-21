import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Ville } from '../models/ville.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VilleService {

    villes$ = new BehaviorSubject<Array<Ville>>([]);

    constructor(
    ) { }

    get villes(): Observable<Array<Ville>> {
        return this.villes$.asObservable();
    }

    getAllFromFirebase() {
        const db = firebase.firestore();
        let villes = new Array<Ville>();
        db.collection('ville-trap').get().then((resultats) => {
            resultats.forEach((resultat) => {
                const ville = resultat.data() as Ville;
                villes.push(ville);
            });
            this.villes$.next(villes);
            console.log("villes");
            console.log(villes);
        }).catch((e) => {
        });

    }
}
