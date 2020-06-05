import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  reservations = [];
  panierSubscription: Subscription;
  TOTAL = 0;
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService
  ) { }

  ngOnInit(): void {
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
      this.router.navigate(['sejour', 'view', reservation.sejour.id]);
    }
    if (reservation.hebergement) {
      this.router.navigate(['hebergement', 'view', reservation.hebergement.id]);
    }
    if (reservation.divertissement) {
      this.router.navigate(['divertissement', 'view', reservation.divertissement.id]);
    }
    if (reservation.transport) {
      this.router.navigate(['transport', 'view', reservation.transport.id]);
    }
  }

  modifier(reservation: Reservation) {
    if (reservation.sejour) {
      this.router.navigate(['sejour', 'view', reservation.sejour.id]);
    }
    if (reservation.hebergement) {
      this.router.navigate(['hebergement', 'view', reservation.hebergement.id]);
    }
    if (reservation.divertissement) {
      this.router.navigate(['divertissement', 'view', reservation.divertissement.id]);
    }
    if (reservation.transport) {
      this.router.navigate(['transport', 'view', reservation.transport.id]);
    }
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

    }
  }

}
