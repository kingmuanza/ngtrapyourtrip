import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Divertissement } from 'src/app/models/divertissement.model';
declare const metro: any;

@Component({
  selector: 'app-loisir-list',
  templateUrl: './loisir-list.component.html',
  styleUrls: ['./loisir-list.component.scss']
})
export class LoisirListComponent implements OnInit {

  divertissements = new Array<Divertissement>();
  resultats = new Array<Divertissement>();
  recherche = '';
  ordre = 'croissant';

  form: FormGroup;

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
    console.log('submit');
    const value = this.form.value;
    const texte = value.rechercher as string;
    const ville = value.ville as string;
    this.resultats = this.divertissements.filter((d) => {
      const t = (texte && d.titre.toLowerCase().indexOf(texte.toLowerCase()) !== -1) || !texte;
      const v = (ville && d.lieu && d.lieu.toLowerCase().indexOf(ville.toLowerCase()) !== -1) || !ville;
      console.log(t);
      console.log(v);
      console.log(t && v);
      return t && v;
    });
    console.log(this.resultats);
    console.log(this.divertissements);
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
