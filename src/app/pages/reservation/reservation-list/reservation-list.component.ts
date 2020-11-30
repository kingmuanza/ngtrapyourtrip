import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subscription } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import * as firebase from 'firebase';
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  reservations = new Array<Reservation>();
  constructor(

    private authService: AuthentificationService,
  ) { }

  ngOnInit(): void {

    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
      if (utilisateur.prestataire) {
        this.getReservationsPrestataire(utilisateur.id);
      } else {
        this.getReservationsNormales(utilisateur.id);
      }
    });
    this.authService.emit();
  }

  getReservationsNormales(id: string) {
    const db = firebase.firestore();
    this.reservations = new Array<Reservation>();
    db.collection('reservation-trap').where('utilisateur.id', '==', id).get().then((resultats) => {
      resultats.forEach((resultat) => {
        const resa = resultat.data() as Reservation;
        this.reservations.push(resa);
      });
      console.log('this.reservations');
      console.log(this.reservations);
    });
  }

  getReservationsPrestataire(id: string) {
    const db = firebase.firestore();
    this.reservations = new Array<Reservation>();
    db.collection('reservation-trap').where('hebergement.prestataire.id', '==', id).get().then((resultats) => {
      resultats.forEach((resultat) => {
        const resa = resultat.data() as Reservation;
        this.reservations.push(resa);
      });
      console.log('this.reservations');
      console.log(this.reservations);
    });

  }

}
