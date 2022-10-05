import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
declare const metro: any;

@Component({
  selector: 'app-accueil-hebergements',
  templateUrl: './accueil-hebergements.component.html',
  styleUrls: ['./accueil-hebergements.component.scss']
})
export class AccueilHebergementsComponent implements OnInit {

  hebergements = new Array<Utilisateur>();
  resultats = new Array<Utilisateur>();
  recherche = '';
  ordre = 'croissant';
  utilisateurs = new Array<Utilisateur>();
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getPrestataires();
  }

  ouvrir(id) {
    this.router.navigate(['hebergement', 'view', id]);
  }

  getPrestataires() {
    this.utilisateurs = new Array<Utilisateur>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          if (utilisateur.prestataire) {
            this.utilisateurs.push(utilisateur);
            this.resultats.push(utilisateur);
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.utilisateurs);
        metro().activity.close(activity);

        resolve(this.utilisateurs);
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

}
