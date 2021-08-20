import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    this.getSejours();
    this.initForm();
  }
  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      ville: ['', []],
      nature: ['tous', []],
      ordre: ['croissant'],
      adultes: [1, []],
      enfants: [0, []],

      relaxation: [false],
      pieds: [false],
      phasenature: [false],
      sportif: [false],
      gastronomique: [false],
      insolite: [false],
      festive: [false],
      affaire: [false],
      culturel: [false],
      animaux: [false],

      spa: [false],
      soin: [false],
      massage: [false],

      pension: [false],
      diner: [false],
      degustation: [false],
      pensioncomplete: [false],

      visiteguidee: [false],
      autresvisites: [false],

      golf: [false],
      sallesport: [false],
      velo: [false],
      tennis: [false],
      basket: [false],

      ponctuel: [false],
      attraction: [false],
      spectacle: [false],
      zoo: [false],
      foire: [false],
      randonnee: [false],

      maisonvacances: [false],
      appartementvacances: [false],
      chambrehotel: [false],
      villagevacances: [false],

      hotel: [false],
      pointrencontre: [false],
      lieuactivite: [false],

      francais: [false],
      anglais: [false],
      arabe: [false],

    });
    this.form.valueChanges.subscribe((val) => {

      this.onSubmitForm();
    });
  }

  onSubmitForm() {

    const value = this.form.value;
    this.resultats = this.sejours;
    this.resultats = this.resultats.filter((prestataire) => {
      const keys = Object.keys(value);
      let toutOK = true;
      keys.forEach((key) => {
        // console.log(key);
        if (value[key] === true) {
          // console.log(key);
          if (prestataire.options && !prestataire.options[key]) {
            toutOK = false;
          }

          if (!prestataire.options) {
            toutOK = false;
          }

        }
      });
      return toutOK;
    });

    this.ordonner(this.ordre);

    console.log('Filtehffjf');
    console.log(this.resultats);

  }

  nouveau() {
    this.router.navigate(['offres', 'sejour', 'edit']);
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
  }

  changerEtoilesIntention(nombre: number) {
    console.log('changerEtoilesIntention : ' + nombre);
    this.triEtoilesIntention = nombre;
  }

  reinitEtoiles() {
    console.log('reinitEtoiles');
    this.triEtoilesIntention = 0;
  }

}
