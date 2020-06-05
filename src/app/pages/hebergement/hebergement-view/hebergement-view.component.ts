import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
import { Hebergement } from 'src/app/models/hebergement.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-view',
  templateUrl: './hebergement-view.component.html',
  styleUrls: ['./hebergement-view.component.scss']
})
export class HebergementViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;

  hebergement: Hebergement;
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
      dateFin: ['', Validators.required],
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
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const personnes = value.personnes;
    const date = this.calendarpickerlocale.nativeElement.value;
    const dateFin = this.calendarpickerlocale2.nativeElement.value;

    if (date && date.length > 2 && dateFin && dateFin.length > 2) {
      const diff = new Date(dateFin).getTime() - new Date(date).getTime();
      console.log('difefrence');
      console.log(diff);

      if (new Date(date).getTime() < new Date(dateFin).getTime()) {

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        console.log('Nombre de jours');
        console.log(days);
        const reservation = new Reservation();
        reservation.hebergement = this.hebergement;
        reservation.personnes = personnes;
        reservation.dateDebut = new Date(date);
        reservation.dateFin = new Date(dateFin);
        reservation.cout = this.hebergement.nuitee * days;

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
          this.router.navigate(['panier']);
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

    } else {
      const notify = metro().notify;
      notify.create('Veuillez renseigner la date', null, {
        cls: 'alert',
        distance: '50vh',
        timeout: 4000,
        duration: 1000
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
      db.collection('hebergements-trap').doc(id).get().then((resultat) => {
        const hebergement = resultat.data() as Hebergement;
        this.hebergement = hebergement;
        console.log('TERMINEEE !!!');
        console.log(this.hebergement);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

}
