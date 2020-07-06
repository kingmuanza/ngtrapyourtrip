import { Component, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-hebergement-list-edit',
  templateUrl: './hebergement-list-edit.component.html',
  styleUrls: ['./hebergement-list-edit.component.scss']
})
export class HebergementListEditComponent implements OnInit {

  hebergement: Hebergement;
  hebergements = new Array<Hebergement>();
  HEBERGEMENTS = new Array<Hebergement>();
  resultats = new Array<Hebergement>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getSejours();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      nature: ['null', []],
      adultes: [1, []],
      enfants: [0, []],
      wifi: [false],
      plage: [false],
      piscine: [false],
      climatiseur: [false],
      parking: [false],
      petitdej: [false],
      gardien: [false],
    });
    this.form.valueChanges.subscribe(() => {
      this.onSubmitForm();
    });
  }

  editHebergement(hebergement) {
    this.hebergement = hebergement;
  }

  onSubmitForm() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    this.resultats = this.hebergements;
    if (value.mot) {
      this.resultats = this.rechercher(value.mot);
    }

    this.resultats = this.resultats.filter((hebergement) => {
      if (hebergement.options) {
        const wifi = value.wifi ? hebergement.options.wifi : true;
        const parking = value.parking ? hebergement.options.parking : true;
        const plage = value.plage ? hebergement.options.plage : true;
        const piscine = value.piscine ? hebergement.options.piscine : true;
        const climatiseur = value.climatiseur ? hebergement.options.climatiseur : true;
        const petitdej = value.petitdej ? hebergement.options.petitdej : true;
        const gardien = value.gardien ? hebergement.options.gardien : true;
        return wifi && parking && plage && piscine && climatiseur && petitdej && gardien;

      } else {
        const wifi = value.wifi ? hebergement.wifi : true;
        const parking = value.parking ? hebergement.parking : true;
        return wifi && parking;
      }
    });

  }

  ouvrir(id) {
    this.router.navigate(['hebergement', 'view', id]);
  }

  modifier(hebergement) {
    this.router.navigate(['offres', 'hebergement', 'edit', hebergement.id]);
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
          if (!hebergement.options) {
            hebergement.options = {
              wifi: false,
              plage: false,
              piscine: false,
              climatiseur: false,
              parking: false,
              petitdej: false,
              gardien: false,
            };
            hebergement.options.parking = hebergement.parking;
            hebergement.options.wifi = hebergement.wifi;
          }
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

  rechercher(mot: string) {
    return this.resultats.filter((sejour) => {
      const description = sejour.description.toLowerCase().indexOf(mot.toLowerCase()) !== -1;
      const titre = sejour.titre.toLowerCase().indexOf(mot.toLowerCase()) !== -1;
      return titre || description;

    });
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
