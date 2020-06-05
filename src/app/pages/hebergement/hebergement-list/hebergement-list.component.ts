import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Hebergement } from 'src/app/models/hebergement.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-list',
  templateUrl: './hebergement-list.component.html',
  styleUrls: ['./hebergement-list.component.scss']
})
export class HebergementListComponent implements OnInit {

  hebergements = new Array<Hebergement>();
  resultats = new Array<Hebergement>();
  recherche = '';
  ordre = 'croissant';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSejours();
  }

  ouvrir(id) {
    this.router.navigate(['hebergement', 'view', id]);
  }

  getSejours() {
    this.hebergements = new Array<Hebergement>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const hebergement = resultat.data() as Hebergement;
          this.hebergements.push(hebergement);
          this.resultats.push(hebergement);
        });
        console.log('TERMINEEE !!!');
        console.log(this.hebergements);
        metro().activity.close(activity);
        this.ordonner(this.ordre);
        resolve(this.hebergements);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  rechercher(ev) {
    console.log(ev);
    this.resultats = this.hebergements;
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
        return a.nuitee - b.nuitee > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.nuitee - b.nuitee > 0 ? -1 : 1;
      });
    }
  }
}
