import { Component, HostListener, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Divertissement } from 'src/app/models/divertissement.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  utilisateurs = new Array<Utilisateur>();
  HEBERGEMENTS = new Array<Utilisateur>();
  resultats = new Array<Utilisateur>();

  divertissements = new Array<Divertissement>();
  resultats2 = new Array<Divertissement>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';

  villes = new Array<string>();
  villesResultats = new Array<string>();

  screenHeight: number;
  screenWidth: number;
  mobile = true;
  nombreVilles = 3;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.getPrestataires();
    this.getDivertissements();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
    } else {
      this.nombreVilles = 6;
    }
  }

  changerOrdre(ordre) {
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  verifier() {
    console.log('click accepté');
  }

  ouvrir(id) {
    console.log(id);
    this.router.navigate(['offres', 'villes', 'view', id]);
  }

  voir(divers: Divertissement) {
    console.log(divers);
    if (divers.date) {
      this.router.navigate(['offres', 'divertissement', 'evenements', 'view', divers.id]);
    } else {
      this.router.navigate(['offres', 'divertissement', 'loisirs', 'view', divers.id]);
    }
  }

  getPrestataires() {
    this.utilisateurs = new Array<Utilisateur>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          const ville = utilisateur.ville;
          if (ville) {
            if (this.villes.indexOf(ville.toLocaleLowerCase().trim()) === -1) {
              this.villes.push(ville.toLocaleLowerCase().trim());
            }
            if (utilisateur.prestataire) {
              this.utilisateurs.push(utilisateur);
              this.resultats.push(utilisateur);
            }
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

  getDivertissements() {
    this.divertissements = new Array<Divertissement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const divertissement = resultat.data() as Divertissement;
          const ville = divertissement.ville;
          if (this.villes.indexOf(ville.toLocaleLowerCase().trim()) === -1) {
            this.villes.push(ville.toLocaleLowerCase().trim());
          }
          this.divertissements.push(divertissement);
          this.resultats2.push(divertissement);

        });
        console.log('diversthjh !!!');
        console.log(this.divertissements);
        if (this.screenWidth > 599) {
        } else {
          this.rechercher('');
        }
        resolve(this.divertissements);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  rechercher(mot: string) {
    console.log('mot');
    console.log(mot);
    console.log(mot.toLocaleLowerCase());
    console.log(mot.toLowerCase());
    console.log('this.villes');
    console.log(this.villes);
    this.villesResultats = this.villes.concat([]);
    this.villesResultats = this.villes.filter((ville) => {
      return ville.toLocaleLowerCase().indexOf(mot.toLocaleLowerCase()) !== -1;
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
