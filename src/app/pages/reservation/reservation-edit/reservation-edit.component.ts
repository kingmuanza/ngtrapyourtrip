import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Trajet } from 'src/app/models/trajet.model';

declare const metro: any;

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss']
})
export class ReservationEditComponent implements OnInit, AfterViewInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;

  reservation: Reservation;
  days = 0;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.getReservation(id);
      this.initForm();
    });
    this.initForm();
  }

  ngAfterViewInit(): void {
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      dateFin: ['', Validators.required],
    });
  }

  muanza() {
    console.log('Bonjour');
    console.log(this.calendarpickerlocale.nativeElement.value);
    this.form.value.date = this.calendarpickerlocale.nativeElement.value;
    this.form.value.dateFin = this.calendarpickerlocale2.nativeElement.value;
    console.log(this.form.value);

    this.form = this.formBuilder.group({
      date: [this.calendarpickerlocale.nativeElement.value, Validators.required],
      dateFin: [this.calendarpickerlocale2.nativeElement.value, Validators.required],
    });

  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

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
        this.reservation.dateDebut = new Date(date);
        this.reservation.dateFin = new Date(dateFin);

        console.log('reservation');
        console.log(this.reservation);

        if (this.reservation.hebergement) {
          this.reservation.cout = this.reservation.hebergement.nuitee * days;
        }

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
        const newPanier = [];
        panier.forEach((reservation: Reservation) => {
          if (reservation.id === this.reservation.id) {
            newPanier.push(this.reservation);
          } else {
            newPanier.push(reservation);
          }
        });
        localStorage.setItem('panier-trap', JSON.stringify(newPanier));

        const db = firebase.firestore();
        db.collection('reservation-trap').doc(this.reservation.id).set(JSON.parse(JSON.stringify(this.reservation))).then((resultats) => {
          console.log('TERMINEEE !!!');
          metro().activity.close(activity);
          this.router.navigate(['offres', 'reservation', 'view', this.reservation.id]);
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

  getReservation(id) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    db.collection('reservation-trap').doc(id).get().then((resultat) => {
      console.log('TERMINEEE !!!');
      this.reservation = resultat.data() as Reservation;
      this.days = this.duree(this.reservation);
      metro().activity.close(activity);
      console.log('ngAfterViewInit');
      console.log(this.calendarpickerlocale);
      this.calendarpickerlocale.nativeElement.value = '1972/12/21';
      this.calendarpickerlocale2.nativeElement.value = new Date().toISOString();
    }).catch((e) => {
      metro().activity.close(activity);
    });
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(48, 164, 221);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(48, 164, 221);"></span>';
    }
    return stars;
  }

  duree(reservation: Reservation) {
    const dateFin = reservation.dateFin;
    const date = reservation.dateDebut;
    const diff = new Date(dateFin).getTime() - new Date(date).getTime();
    console.log('difference');
    console.log(diff);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log('Nombre de jours');
    console.log(days);
    return days;
  }

  toDate(str) {
    return new Date(str);
  }

  revenir() {
    this.router.navigate(['offres', 'reservation', 'view', this.reservation.id]);
  }

  description(trajet: Trajet) {
    if (trajet) {
      if (trajet.villeArrivee === trajet.villeDepart) {
        return 'Location de voiture : ' + trajet.villeArrivee;
      } else {
        return trajet.villeDepart + ' - ' + trajet.villeArrivee;
      }
    } else {
      return '';
    }
  }


}
