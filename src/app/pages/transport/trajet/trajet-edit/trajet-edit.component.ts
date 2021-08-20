import { Component, OnInit } from '@angular/core';
import { Trajet } from 'src/app/models/trajet.model';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const db = firebase.firestore();
      db.collection('trajets-trap').doc(id).get().then((resultat) => {
        const trajet = resultat.data() as Trajet;
        this.trajet = trajet;
        this.initForm();
      }).catch((e) => {
      });
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      villeDepart: [this.trajet ? this.trajet.villeDepart : '', Validators.required],
      villeArrivee: [this.trajet ? this.trajet.villeArrivee : '', Validators.required],
      duree: [this.trajet ? this.trajet.duree : ''],
      retour: [false]
    });

  }

  onSubmitForm() {
    const value = this.form.value;
    let trajet = new Trajet();
    if (this.trajet) {
      trajet = this.trajet;
    }
    const trajetRetour = new Trajet();

    let retour = value.retour;
    if (this.trajet) {
      retour = false;
    }
    console.log('retour');
    console.log(retour);
    trajet.villeArrivee = value.villeArrivee;
    trajet.villeDepart = value.villeDepart;
    trajet.duree = value.duree;

    trajetRetour.villeArrivee = value.villeDepart;
    trajetRetour.villeDepart = value.villeArrivee;
    trajetRetour.duree = value.duree;

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
        this.router.navigate(['offres', 'transport']);
      }
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

}
