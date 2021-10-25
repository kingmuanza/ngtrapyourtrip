import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier.service';
import { Subscription } from 'rxjs';
import { Trajet } from 'src/app/models/trajet.model';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  reservations = [];
  panierSubscription: Subscription;
  TOTAL = 0;
  isUser = false;
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService
  ) { }

  ngOnInit(): void {
    if (this.authService.utilisateur) {
      this.isUser = true;
    } else {
      this.isUser = false;
    }
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations;
      this.reservations.forEach((reservation: Reservation) => {
        this.TOTAL += reservation.cout;
      });
    });
    this.panierService.getPanier();
  }

  suivant() {
    if (this.authService.utilisateur) {
      this.router.navigate(['dashboard', 'paiement', 'edit']);
    } else {
      this.router.navigate(['inscription']);
    }

  }

  voir(reservation: Reservation) {
    if (reservation.sejour) {
      this.router.navigate(['offres', 'sejour', 'view', reservation.sejour.id]);
    }
    if (reservation.hebergement) {
      this.router.navigate(['offres', 'hebergement', 'view', reservation.hebergement.id]);
    }
    if (reservation.divertissement) {
      if (reservation.divertissement.date) {
        this.router.navigate(['offres', 'divertissement', 'evenements', 'view', reservation.divertissement.id]);
      } else {
        this.router.navigate(['offres', 'divertissement', 'loisirs', 'view', reservation.divertissement.id]);
      }
    }
    if (reservation.transport) {
      this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
    }
    if (reservation.locationVoiture) {
      this.router.navigate(['offres', 'transport', 'location', reservation.locationVoiture.voiture.id]);
    }
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

  toDate(str) {
    return new Date(str);
  }


}
