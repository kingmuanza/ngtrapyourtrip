import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DivertissementItem } from 'src/app/models/divertissement.item.model';
import { Reservation } from 'src/app/models/reservation.model';
declare const metro: any;

@Component({
  selector: 'app-divertissement-item-view',
  templateUrl: './divertissement-item-view.component.html',
  styleUrls: ['./divertissement-item-view.component.scss']
})
export class DivertissementItemViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  divertissementItem: DivertissementItem;
  form: FormGroup;

  indexImages = 0;
  changeImage;
  heures = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {

    for (let i = 1; i < 10; i++) {
      this.heures.push('0' + i + ':00');
    }
    for (let i = 10; i < 24; i++) {
      this.heures.push(i + ':00');
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getItem(id);
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      personnes: [1, Validators.required],
      heure: ['00:00', Validators.required],
    });
  }

  getItem(id: string) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-item-trap').doc(id).get().then((resultat) => {
        const divertissementItem = resultat.data() as DivertissementItem;
        this.divertissementItem = divertissementItem;
        this.changementDimages();
        console.log('TERMINEEE !!!');
        console.log(this.divertissementItem);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const personnes = value.personnes;
    const heure = value.heure;
    const date = this.calendarpickerlocale.nativeElement.value;

    console.log('date reservation');
    console.log(date);
    if (date) {
      if (new Date(date + 'T' + heure).getTime() > new Date().getTime()) {
        const reservation = new Reservation();
        reservation.divertissementItem = this.divertissementItem;
        reservation.personnes = personnes;
        reservation.dateDebut = new Date(date + 'T' + heure);
        reservation.cout = this.divertissementItem.prix * personnes;

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
        alert('La date d\'arrivée de réservation doit être supérieure à la date d\'aujourd\'hui ');
      }
    } else {
      alert('Veuillez entre une date');
    }

  }

  choisir(i) {
    this.indexImages = i;
  }

  changementDimages() {
    if (this.divertissementItem) {
      if (this.divertissementItem.images) {
        if (this.divertissementItem.images.length > 0) {
          this.indexImages = 0;
          this.changeImage = setInterval(() => {
            const i = this.indexImages + 1;
            if (i < this.divertissementItem.images.length) {
              this.indexImages++;
            } else {
              this.indexImages = 0;
            }
            console.log('changement dimage');
            console.log(this.indexImages + ' sur ' + this.divertissementItem.images.length);
          }, 10000);
        }
      }
    }
  }

}
