import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Reservation } from 'src/app/models/reservation.model';
declare const metro: any;

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.scss']
})
export class RestaurantViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  heures = [];
  divertissement: Divertissement;
  form: FormGroup;

  indexImages = 0;
  changeImage;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    for (let i = 1; i < 10; i++) {
      this.heures.push('0' + i + ':00');
    }
    for (let i = 10; i < 24; i++) {
      this.heures.push(i + ':00');
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id);
      }
    });
    this.initForm();
  }

  modifier(element) {
    this.router.navigate(['offres', 'divertissement', 'edit', element.id]);
  }

  supprimer(element) {
    const oui = confirm('Etes vous sûr de vouloir supprimer cet élément ?');
    const db = firebase.firestore();
    db.collection('divertissements').doc(element.id).delete().then(() => {
      this.router.navigate(['offres', 'divertissement']);
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      heure: ['', Validators.required],
      personnes: [1, Validators.required]
    });

    // tslint:disable-next-line:no-string-literal
    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    const date = this.calendarpickerlocale.nativeElement.value;

    const personnes = value.personnes;

    if (date && value.heure) {
      if (new Date(date).getTime() > new Date().getTime()) {
        const reservation = new Reservation();
        this.divertissement.date = new Date(date + 'T' + value.heure + ':00');
        reservation.divertissement = this.divertissement;
        reservation.personnes = personnes;
        reservation.dateDebut = new Date(date);
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
        alert('La date doit être spérieure à celle d\'aujourd\'hui');
      }
    } else {
      alert('Veuillez renseigner la date et l\'heure');
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
        this.changementDimages();
        console.log('TERMINEEE !!!');
        console.log(this.divertissement);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

  choisir(i) {
    this.indexImages = i;
  }

  changementDimages() {
    if (this.divertissement) {
      if (this.divertissement.images) {
        if (this.divertissement.images.length > 0) {
          this.indexImages = 0;
          this.changeImage = setInterval(() => {
            const i = this.indexImages + 1;
            if (i < this.divertissement.images.length) {
              this.indexImages++;
            } else {
              this.indexImages = 0;
            }
            console.log('changement dimage');
            console.log(this.indexImages + ' sur ' + this.divertissement.images.length);
          }, 10000);
        }
      }
    }
  }

  ouvrirGoogleMap() {
    const lien = 'http://maps.google.com/maps?q=' +  this.divertissement.latitude + ',' + this.divertissement.longitude;
    window.open(lien);
  }

}
