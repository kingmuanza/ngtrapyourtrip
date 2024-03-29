import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Trajet } from 'src/app/models/trajet.model';
import { PanierService } from 'src/app/services/panier.service';
import { Subscription } from 'rxjs';

declare const metro: any;

@Component({
  selector: 'app-reservation-recap',
  templateUrl: './reservation-recap.component.html',
  styleUrls: ['./reservation-recap.component.scss']
})
export class ReservationRecapComponent implements OnInit {

  reservation: Reservation;
  days = 0;
  form: FormGroup;
  panierSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private panierService: PanierService,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.getReservation(id);
      this.initForm();
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      tel: ['', Validators.required],
      numero: ['', Validators.required],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');

    this.reservation.responsable = value;

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
    if (panier.length > 0) {
      panier.forEach((reservation: Reservation) => {
        if (reservation.id === this.reservation.id) {
          newPanier.push(this.reservation);
        } else {
          newPanier.push(reservation);
        }
      });
    } else {
      newPanier.push(this.reservation);
    }
    localStorage.setItem('panier-trap', JSON.stringify(newPanier));

    const db = firebase.firestore();
    db.collection('reservation-trap').doc(this.reservation.id).set(JSON.parse(JSON.stringify(this.reservation))).then((resultats) => {
      console.log('TERMINEEE !!!');
      metro().activity.close(activity);

      this.panierService.reservations = newPanier;
      this.panierService.emit();
      this.router.navigate(['offres', 'reservation', 'recap', this.reservation.id]);
    }).catch((e) => {
      metro().activity.close(activity);
    });
  }

  getReservation(id: string) {
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

  panier() {
    console.log('voici alors le panier');
    const panierString = localStorage.getItem('panier-trap');
    let panier = [];

    if (panierString) {
      panier = JSON.parse(panierString);
    }
    const newPanier = [];
    let existe = false;

    if (panier.length > 0) {
      panier.forEach((reservation: Reservation) => {
        if (reservation.id === this.reservation.id) {
          newPanier.push(this.reservation);
          existe = true;
        } else {
          newPanier.push(reservation);
        }
      });
      if (!existe) {
        newPanier.push(this.reservation);
      }
    } else {
      newPanier.push(this.reservation);
    }

    console.log('newPanier');
    console.log(newPanier);

    localStorage.setItem('panier-trap', JSON.stringify(newPanier));

    setTimeout(() => {
      this.router.navigate(['panier']);
    }, 500);
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
