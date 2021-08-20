import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-prestataire-list',
  templateUrl: './prestataire-list.component.html',
  styleUrls: ['./prestataire-list.component.scss']
})
export class PrestataireListComponent implements OnInit {

  @ViewChild('ville', { static: false }) departInput: ElementRef;

  utilisateurs = new Array<Utilisateur>();
  HEBERGEMENTS = new Array<Utilisateur>();
  resultats = new Array<Utilisateur>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  triEtoiles = 0;
  triEtoilesIntention = 0;

  filtersShowed = false;
  recherchesShowed = false;
  screenHeight: number;
  screenWidth: number;
  mobile = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.getPrestataires();
    this.initForm();
  }

  toggleFilter() {
    this.filtersShowed = !this.filtersShowed;
  }

  rechercheFilter() {
    this.recherchesShowed = !this.recherchesShowed;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
      this.filtersShowed = true;
      this.recherchesShowed = true;
    }
  }

  changerEtoiles(nombre: number) {
    console.log('changerEtoiles : ' + nombre);
    this.triEtoiles = nombre;
    this.triEtoilesIntention = nombre;
    this.resultats = this.utilisateurs;
    this.resultats = this.resultats.filter((prestataire) => {
      return prestataire.notation && prestataire.notation >= nombre;
    });
  }

  changerEtoilesIntention(nombre: number) {
    console.log('changerEtoilesIntention : ' + nombre);
    this.triEtoilesIntention = nombre;
  }

  reinitEtoiles() {
    console.log('reinitEtoiles');
    this.triEtoilesIntention = 0;
  }

  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      ville: ['', []],
      nature: ['tous', []],
      ordre: ['croissant'],
      adultes: [1, []],
      enfants: [0, []],

      piscine: [false],
      plage: [false],
      spa: [false],
      petitdej: [false],
      dej: [false],
      cuisine: [false],

      hotel: [false],
      appartement: [false],

      wifi: [false],
      climatiseur: [false],
      parking: [false],
      gardien: [false],
    });
    this.form.valueChanges.subscribe((val) => {

      this.onSubmitForm();
      this.changerOrdre(val.ordre);
    });
  }

  onSubmitForm() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    let nature = value.nature;
    if (nature) {
      if (nature === 'null') {
        if (value.hotel) {
          nature = 'hotel';
        }
        if (value.appartement) {
          nature = 'villa';
        }
        if (value.appartement && value.hotel) {
          nature = null;
        }
      }

    } else {
      if (value.hotel) {
        nature = 'hotel';
      }
      if (value.appartement) {
        nature = 'villa';
      }
    }
    this.resultats = this.utilisateurs;
    if (value.mot) {
      this.resultats = this.rechercher(value.mot);
    }
    if (value.ville) {
      this.resultats = this.rechercher(value.ville);
    }

    let options = true;

    this.resultats = this.resultats.filter((prestataire) => {
      if (prestataire.options) {
        const piscine = value.piscine ? prestataire.options.piscine : true;
        const plage = value.plage ? prestataire.options.plage : true;
        const spa = value.spa ? prestataire.options.spa : true;
        const petitdej = value.petitdej ? prestataire.options.petitdej : true;
        const dej = value.dej ? prestataire.options.dej : true;
        const cuisine = value.cuisine ? prestataire.options.cuisine : true;
        options = dej && cuisine && plage && piscine && petitdej && spa;

      } else {
        options = true;
      }
      if (nature === 'villa') {
        return options && prestataire && prestataire.prestataire && (prestataire.villa || !prestataire.hotel);
      }
      if (nature === 'hotel') {
        return options && prestataire && prestataire.prestataire && prestataire.hotel;
      }
      return options && prestataire && prestataire.prestataire;
    });

    this.ordonner(this.ordre);

    console.log('Filtehffjf');
    console.log(this.resultats);

  }

  changerOrdre(ordre) {
    console.log('ordre');
    console.log(ordre);
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  ouvrir(id) {
    this.router.navigate(['utilisateur', 'view', id]);
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
        metro().activity.close(activity);
        this.ordonner(this.ordre);
        resolve(this.utilisateurs);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  rechercher(mot: string) {
    return this.resultats.filter((utilisateur) => {
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
    }
    if (ev === 'decroissant') {
      this.resultats.sort((a, b) => {
        return a.notation - b.notation > 0 ? -1 : 1;
      });
    }
    console.log(ev);
    if (ev === 'croissant-prix') {
      this.resultats.sort((a, b) => {
        if (!a.prixMin) {
          a.prixMin = 0;
        }
        if (!b.prixMin) {
          b.prixMin = 0;
        }
        return a.prixMin - b.prixMin > 0 ? 1 : -1;
      });
    }
    if (ev === 'decroissant-prix') {
      this.resultats.sort((a, b) => {
        if (!a.prixMin) {
          a.prixMin = 0;
        }
        if (!b.prixMin) {
          b.prixMin = 0;
        }
        return a.prixMin - b.prixMin > 0 ? -1 : 1;
      });
    }
  }

  nouveau() {
    this.router.navigate(['prestataire', 'edit']);
  }
}
