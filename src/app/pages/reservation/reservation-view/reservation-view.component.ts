import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import { Trajet } from 'src/app/models/trajet.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Subscription } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';

declare const metro: any;

@Component({
  selector: 'app-reservation-view',
  templateUrl: './reservation-view.component.html',
  styleUrls: ['./reservation-view.component.scss']
})
export class ReservationViewComponent implements OnInit {

  reservation: Reservation;
  days = 0;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  showconnexionObligatoire = false;
  interval;
  seconds = 5;

  constructor(
    private authService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    this.authService.emit();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.getReservation(id);
    });
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

  edit(reservation: Reservation) {
    this.router.navigate(['offres', 'reservation', 'edit', reservation.id]);
  }

  infos(reservation: Reservation) {
    this.router.navigate(['offres', 'reservation', 'infos', reservation.id]);
    if (this.utilisateur) {
    } else {
      /* this.showconnexionObligatoire = true;
      this.interval = setInterval(() => {
        this.seconds--;
      }, 1000);
      setTimeout(() => {
        clearInterval(this.interval);
        localStorage.setItem('connexion-url', reservation.id);
        this.router.navigate(['connexion']);
      }, 5000); */
    }
  }

  okJaiCompris(reservation: Reservation) {
    clearInterval(this.interval);
    localStorage.setItem('connexion-url', reservation.id);
    this.router.navigate(['connexion']);
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
