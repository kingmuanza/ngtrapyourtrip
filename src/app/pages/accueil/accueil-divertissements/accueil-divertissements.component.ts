import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Divertissement } from 'src/app/models/divertissement.model';
declare const metro: any;

@Component({
  selector: 'app-accueil-divertissements',
  templateUrl: './accueil-divertissements.component.html',
  styleUrls: ['./accueil-divertissements.component.scss']
})
export class AccueilDivertissementsComponent implements OnInit {

  divertissements = new Array<Divertissement>();
  resultats = new Array<Divertissement>();
  recherche = '';
  ordre = 'croissant';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSejours();
  }

  ouvrir(id) {
    this.router.navigate(['divertissement', 'view', id]);
  }

  getSejours() {
    this.divertissements = new Array<Divertissement>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const divertissement = resultat.data() as Divertissement;
          this.divertissements.push(divertissement);
          this.resultats.push(divertissement);
        });
        console.log('TERMINEEE !!!');
        console.log(this.divertissements);
        metro().activity.close(activity);
        this.ordonner(this.ordre);
        resolve(this.divertissements);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  rechercher(ev) {
    console.log(ev);
    this.resultats = this.divertissements;
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
        return a.prix - b.prix > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.prix - b.prix > 0 ? -1 : 1;
      });
    }
  }
}
