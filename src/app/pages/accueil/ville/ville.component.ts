import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';

@Component({
  selector: 'app-ville',
  templateUrl: './ville.component.html',
  styleUrls: ['./ville.component.scss']
})
export class VilleComponent implements OnInit {

  prestataires = new Array<Utilisateur>();
  divertissements = new Array<Divertissement>();
  evenements = new Array<Divertissement>();
  loisirs = new Array<Divertissement>();
  restaurants = new Array<Divertissement>();
  nom = '';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.nom = id;
      this.getDivertissements(id);
      this.getPrestataires(id).then((prestataires) => {
        this.prestataires = prestataires;
      });
    });
  }

  getPrestataires(id: string): Promise<Array<Utilisateur>> {
    this.prestataires = new Array<Utilisateur>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          if (utilisateur.prestataire) {
            if (id.indexOf(utilisateur.ville) !== -1) {
              this.prestataires.push(utilisateur);
            }
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.prestataires);
        resolve(this.prestataires);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getDivertissements(id: string) {
    this.divertissements = new Array<Divertissement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const divertissement = resultat.data() as Divertissement;
          console.log('divertissement');
          console.log(divertissement);
          if (divertissement.ville && id.toLocaleLowerCase().indexOf(divertissement.ville.toLocaleLowerCase()) !== -1) {
            this.divertissements.push(divertissement);
            if (divertissement.date) {
              this.evenements.push(divertissement);
            } else {
              if (divertissement.restaurant) {
                this.restaurants.push(divertissement);
              } else {
                this.loisirs.push(divertissement);
              }
            }
          }
        });
        console.log('diversthjh !!!');
        console.log(this.divertissements);
        resolve(this.divertissements);
      }).catch((e) => {
        reject(e);
      });
    });
  }

}
