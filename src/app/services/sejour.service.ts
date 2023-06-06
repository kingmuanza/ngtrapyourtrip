import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Sejour } from '../models/sejour.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SejourService {

  sejours$ = new BehaviorSubject<Array<Sejour>>([]);

  constructor(
  ) { }

  get sejours(): Observable<Array<Sejour>> {
    return this.sejours$.asObservable();
  }

  getAllFromFirebase() {
    const db = firebase.firestore();
    let sejours = new Array<Sejour>();
    db.collection('sejours-trap').get().then((resultats) => {
      resultats.forEach((resultat) => {
        const sejour = resultat.data() as Sejour;
        sejours.push(sejour);
      });
      this.sejours$.next(sejours);
      console.log("sejours");
      console.log(sejours);
    }).catch((e) => {
    });

  }
}
