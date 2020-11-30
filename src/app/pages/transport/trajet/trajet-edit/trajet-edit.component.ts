import { Component, OnInit } from '@angular/core';
import { Trajet } from 'src/app/models/trajet.model';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
declare const metro: any;

@Component({
  selector: 'app-trajet-edit',
  templateUrl: './trajet-edit.component.html',
  styleUrls: ['./trajet-edit.component.scss']
})
export class TrajetEditComponent implements OnInit {

  trajet: Trajet;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      villeDepart: ['', Validators.required],
      villeArrivee: ['', Validators.required],
      retour: [false]
    });

  }

  onSubmitForm() {
    const value = this.form.value;
    const trajet = new Trajet();
    const trajetRetour = new Trajet();

    let retour = value.retour;
    console.log('retour');
    console.log(retour);
    trajet.villeArrivee = value.villeArrivee;
    trajet.villeDepart = value.villeDepart;

    trajetRetour.villeArrivee = value.villeDepart;
    trajetRetour.villeDepart = value.villeArrivee;

    if (value.villeArrivee === value.villeDepart) {
      retour = false;
    }

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    db.collection('trajets-trap').doc(trajet.id).set(JSON.parse(JSON.stringify(trajet))).then(() => {
      if (retour) {
        db.collection('trajets-trap').doc(trajetRetour.id).set(JSON.parse(JSON.stringify(trajetRetour))).then(() => {
          console.log('TERMINEEE !!!');
          metro().activity.close(activity);
          this.router.navigate(['offres', 'transport']);
        }).catch((e) => {
          metro().activity.close(activity);
        });
      } else {
        metro().activity.close(activity);
        // this.router.navigate(['offres', 'transport']);
      }
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

}
