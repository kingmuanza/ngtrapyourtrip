import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
declare const metro: any;

@Component({
  selector: 'app-accueil-sejours',
  templateUrl: './accueil-sejours.component.html',
  styleUrls: ['./accueil-sejours.component.scss']
})
export class AccueilSejoursComponent implements OnInit {

  sejours = new Array<Sejour>();
  constructor() { }

  ngOnInit(): void {
    this.getSejours();
  }

  getSejours() {
    this.sejours = new Array<Sejour>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 1
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('sejours-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const sejour = resultat.data() as Sejour;
          this.sejours.push(sejour);
        });
        console.log('TERMINEEE !!!');
        console.log(this.sejours);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }
}
