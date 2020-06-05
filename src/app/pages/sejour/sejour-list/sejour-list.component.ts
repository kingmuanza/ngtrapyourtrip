import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
declare const metro: any;

@Component({
  selector: 'app-sejour-list',
  templateUrl: './sejour-list.component.html',
  styleUrls: ['./sejour-list.component.scss']
})
export class SejourListComponent implements OnInit {

  sejours = new Array<Sejour>();
  resultats = new Array<Sejour>();
  recherche = '';
  ordre = 'croissant';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSejours();
  }

  ouvrir(id) {
    this.router.navigate(['sejour', 'view', id]);
  }

  getSejours() {
    this.sejours = new Array<Sejour>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('sejours-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const sejour = resultat.data() as Sejour;
          this.sejours.push(sejour);
          this.resultats.push(sejour);
        });
        console.log('TERMINEEE !!!');
        console.log(this.sejours);
        metro().activity.close(activity);
        this.ordonner(this.ordre);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

  rechercher(ev) {
    console.log(ev);
    this.resultats = this.sejours;
    if (ev) {
      this.resultats = this.resultats.filter((sejour) => {
        return sejour.description.toLowerCase().indexOf(ev) !== -1;
      });
    }
  }

  ordonner(ev) {
    console.log(ev);
    if (ev === 'croissant') {
      this.resultats.sort((a, b) => {
        return a.prixUnitaire - b.prixUnitaire > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.prixUnitaire - b.prixUnitaire > 0 ? -1 : 1;
      });
    }
  }

}
