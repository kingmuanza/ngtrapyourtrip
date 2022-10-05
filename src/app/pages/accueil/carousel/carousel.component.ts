import { Component, HostListener, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Ville } from 'src/app/models/ville.model';

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

  villes = new Array<Ville>();
  villesResultats = new Array<Ville>();

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
    this.getVilles();
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

  getVilles() {
    this.villes = new Array<Ville>();
    const db = firebase.firestore();
    db.collection('ville-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      resultats.forEach((resultat) => {
        const ville = resultat.data() as Ville;
        this.villes.push(ville);
      });
      this.villesResultats = this.villes.concat([]);
    }).catch((e) => {
    });
  }

  changerOrdre(ordre) {
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  verifier() {
    console.log('click accepté');
  }

  ouvrir(ville: any) {
    console.log('id');
    console.log(ville);
    this.router.navigate(['offres', 'villes', 'view', ville.id]);
  }

  voir(divers: Divertissement) {
    console.log(divers);
    if (divers.date) {
      this.router.navigate(['offres', 'divertissement', 'evenements', 'view', divers.id]);
    } else {
      this.router.navigate(['offres', 'divertissement', 'loisirs', 'view', divers.id]);
    }
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
      return ville.nom.toLocaleLowerCase().indexOf(mot.toLocaleLowerCase()) !== -1;
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
