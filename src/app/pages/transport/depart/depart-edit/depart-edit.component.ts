import { Component, OnInit } from '@angular/core';
import { Agence } from 'src/app/models/agence.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Trajet } from 'src/app/models/trajet.model';
import { Depart } from 'src/app/models/depart.model';
declare const metro: any;

@Component({
  selector: 'app-depart-edit',
  templateUrl: './depart-edit.component.html',
  styleUrls: ['./depart-edit.component.scss']
})
export class DepartEditComponent implements OnInit {

  agences = new Array<Agence>();
  trajets = new Array<Trajet>();
  depart: Depart;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    // this.getTrajets();
    // this.getAgences();
  }

  initForm() {
    this.form = this.formBuilder.group({
      agence: [this.depart ? this.depart.agence : null, Validators.required],
      trajet: [this.depart ? this.depart.trajet : null, Validators.required],
      modele: [this.depart ? this.depart.modele : 'Gros porteur', Validators.required],
      prix: [this.depart ? this.depart.prix : '5000', Validators.required],
      vip: [this.depart ? this.depart.vip : true],
      heures: [this.depart ? this.depart.heures : '08:00; 09:00; 10:00; 11:00; 12:00; 13:00; 14:00; 15:00', Validators.required],
    });

  }

  onSubmitForm() {
    const value = this.form.value;
    const depart = new Depart();

    depart.agence = value.agence;
    depart.trajet = value.trajet;
    depart.modele = value.modele;
    depart.agence = value.agence;
    depart.prix = value.prix;
    depart.vip = value.vip;
    const horaires = value.heures.split(';');
    const heures = new Array<Date>();
    console.log('value.vip');
    console.log(value.vip);
    console.log('depart');
    console.log(depart);

    horaires.forEach((h) => {
      const heure = new Date('2020-01-01 ' + h);
      heures.push(heure);
    });
    depart.heures = heures;

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    db.collection('departs-trap').doc(depart.id).set(JSON.parse(JSON.stringify(depart))).then(() => {
      metro().activity.close(activity);
      this.router.navigate(['offres', 'transport']);
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

  getTrajets() {
    console.log('tajets debut');
    const db = firebase.firestore();
    db.collection('trajets-trap').get().then((resultats) => {
      resultats.forEach((resultat) => {
        const trajet = resultat.data() as Trajet;
        this.trajets.push(trajet);
      });
      console.log('tajets fin');
    }).catch((e) => {
      console.log(e);
    });
  }

  getAgences() {
    const db = firebase.firestore();
    db.collection('agences-trap').get().then((resultats) => {
      resultats.forEach((resultat) => {
        const agence = resultat.data() as Agence;
        this.agences.push(agence);
      });
    }).catch((e) => {
    });
  }

}
