import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Ville } from 'src/app/models/ville.model';
declare const metro: any;

@Component({
  selector: 'app-loisir-list',
  templateUrl: './loisir-list.component.html',
  styleUrls: ['./loisir-list.component.scss']
})
export class LoisirListComponent implements OnInit {
  @ViewChild('ville', { static: false }) ville: ElementRef;

  divertissements = new Array<Divertissement>();
  resultats = new Array<Divertissement>();
  recherche = '';
  ordre = 'croissant';
  villes = new Array<Ville>();
  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getSejours();
    this.getVilles();
    this.initForm();
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
    }).catch((e) => {
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      rechercher: ['', Validators.required],
      ville: ['', Validators.required],
    });
    this.form.valueChanges.subscribe((val) => {
      console.log('val');
      console.log(val);
      this.onFormSubmit();
    });
  }

  onFormSubmit() {
    const ville: string = this.form.value.ville;
    const texte = this.form.value.rechercher;
    console.log(ville);
    console.log(texte);
    this.resultats = this.divertissements;
    if (ville) {
      this.resultats = this.divertissements.filter((divertissement) => {
        return divertissement.ville && divertissement.ville.toLowerCase().indexOf(ville.toLowerCase()) !== -1;
      });
    }
    if (texte) {
      this.resultats = this.resultats.filter((divertissement) => {
        return divertissement.titre && divertissement.titre.toLowerCase().indexOf(texte.toLowerCase()) !== -1;
      });
    }
  }

  goToAll() {
    this.router.navigate(['offres', 'divertissement']);
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
      db.collection('divertissements-trap').orderBy('date', 'desc').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const divertissement = resultat.data() as Divertissement;
          if (!divertissement.date) {
            if (!divertissement.restaurant) {
              this.divertissements.push(divertissement);
              this.resultats.push(divertissement);
            }
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.divertissements);
        metro().activity.close(activity);
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
