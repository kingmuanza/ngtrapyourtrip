import { Component, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  utilisateurs = new Array<Utilisateur>();
  HEBERGEMENTS = new Array<Utilisateur>();
  resultats = new Array<Utilisateur>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getPrestataires();
  }

  changerOrdre(ordre) {
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  verifier()  {
    console.log('click accepté');
  }

  ouvrir(prestataire) {
    console.log(prestataire);
    this.router.navigate(['offres', 'hebergement', 'prestataire', prestataire.id]);
  }

  getPrestataires() {
    this.utilisateurs = new Array<Utilisateur>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          /*if (!utilisateur.options) {
            utilisateur.options = {
              wifi: false,
              plage: false,
              piscine: false,
              climatiseur: false,
              parking: false,
              petitdej: false,
              gardien: false,
            };
            utilisateur.options.parking = utilisateur.parking;
            utilisateur.options.wifi = utilisateur.wifi;
          }*/
          if (utilisateur.prestataire) {
            this.utilisateurs.push(utilisateur);
            this.resultats.push(utilisateur);
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.utilisateurs);
        this.ordonner(this.ordre);
        resolve(this.utilisateurs);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  rechercher(mot: string) {
    console.log('mot');
    console.log(mot);
    this.resultats = this.utilisateurs.filter((utilisateur) => {
      const description = utilisateur.description ? utilisateur.description.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const titre = utilisateur.nom ? utilisateur.nom.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const pays = utilisateur.pays ? utilisateur.pays.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const ville = utilisateur.ville ? utilisateur.ville.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const lieu = utilisateur.localisation ? utilisateur.localisation.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      return titre || description || pays || ville || lieu;

    });
  }

  ordonner(ev) {
    console.log(ev);
    if (ev === 'croissant') {
      this.resultats.sort((a, b) => {
        return a.notation - b.notation > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.notation - b.notation > 0 ? -1 : 1;
      });
    }
  }
}
