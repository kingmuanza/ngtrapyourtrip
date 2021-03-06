import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
import { Divertissement } from 'src/app/models/divertissement.model';
declare const metro: any;

@Component({
  selector: 'app-divertissement-view',
  templateUrl: './divertissement-view.component.html',
  styleUrls: ['./divertissement-view.component.scss']
})
export class DivertissementViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  divertissement: Divertissement;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id);
      }
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      personnes: [1, Validators.required]
    });

    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const personnes = value.personnes;

    if (true) {
      const reservation = new Reservation();
      reservation.divertissement = this.divertissement;
      reservation.personnes = personnes;
      reservation.dateDebut = new Date(this.divertissement.date);
      reservation.cout = this.divertissement.prix * personnes;

      console.log('reservation');
      console.log(reservation);

      const activity = metro().activity.open({
        type: 'square',
        overlayColor: '#fff',
        overlayAlpha: 0.8
      });

      const panierString = localStorage.getItem('panier-trap');
      let panier = [];
      if (panierString) {
        panier = JSON.parse(panierString);
      }
      panier.push(reservation);
      localStorage.setItem('panier-trap', JSON.stringify(panier));

      const db = firebase.firestore();
      db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
      }).catch((e) => {
        metro().activity.close(activity);
      });

    } else {
      const notify = metro().notify;
      notify.create('La date d\'arrivée est supérieure à la date de départ', null, {
        cls: 'alert',
        distance: '50vh',
        duration: 1000,
        timeout: 4000
      });
    }

  }

  getSejour(id: string) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').doc(id).get().then((resultat) => {
        const divertissement = resultat.data() as Divertissement;
        this.divertissement = divertissement;
        console.log('TERMINEEE !!!');
        console.log(this.divertissement);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

}
