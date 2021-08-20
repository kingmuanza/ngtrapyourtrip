import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier.service';
import { Subscription } from 'rxjs';
import { Trajet } from 'src/app/models/trajet.model';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  reservations = new Array<Reservation>();
  panierSubscription: Subscription;
  TOTAL = 0;
  isUser = false;
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService
  ) { }

  ngOnInit(): void {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    db.collection('reservation-trap').get().then((resultats) => {
      resultats.forEach((resultat) => {
        const reservation = resultat.data() as Reservation;
        if (reservation.responsable) {
          this.reservations.push(reservation);
        }
        this.reservations.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime() > 0 ? -1 : 1;
        })
      });
      console.log('TERMINEEE !!!');
      metro().activity.close(activity);
    }).catch((e) => {
      metro().activity.close(activity);
    });
  }

  suivant() {
    if (this.authService.utilisateur) {
      this.router.navigate(['dashboard', 'paiement', 'edit']);
    } else {
      this.router.navigate(['inscription']);
    }

  }

  voir(reservation: Reservation) {
      this.router.navigate(['offres', 'reservation', 'recap', reservation.id]);
  }

  modifier(reservation: Reservation) {
    this.router.navigate(['offres', 'reservation', 'view', reservation.id]);

  }

  supprimer(id) {
    const oui = confirm('Etes-vous sûr de vouloir annuler la réservation ?');
    if (oui) {
      const reservations = [];
      this.reservations.forEach((reservation) => {
        if (reservation.id === id) {

        } else {
          reservations.push(reservation);
        }
      });
      this.reservations = reservations;
      localStorage.setItem('panier-trap', JSON.stringify(reservations));
      this.panierService.reservations = reservations;
      this.panierService.emit();
    }
  }

  supprimerTout() {
    const oui = confirm('Etes-vous sûr de vouloir supprimer toutes les reservations ?');
    if (oui) {
      this.reservations = [];
      localStorage.setItem('panier-trap', JSON.stringify([]));
      this.panierService.reservations = [];
      this.panierService.emit();
      this.TOTAL = 0;
    }
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
