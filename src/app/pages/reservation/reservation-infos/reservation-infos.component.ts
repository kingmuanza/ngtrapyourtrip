import { Component, OnInit, ViewChild } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Trajet } from 'src/app/models/trajet.model';
import { Subscription } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { AuthentificationService } from 'src/app/services/authentification.service';

declare const metro: any;

@Component({
  selector: 'app-reservation-infos',
  templateUrl: './reservation-infos.component.html',
  styleUrls: ['./reservation-infos.component.scss']
})
export class ReservationInfosComponent implements OnInit {

  reservation: Reservation;
  days = 0;
  form: FormGroup;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  responsable: any;

  constructor(
    private authService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    localStorage.removeItem('connexion-url');
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
      this.initForm();
      if (this.utilisateur) {
        if (this.utilisateur.uid) {
          const db = firebase.firestore();
          db.collection('responsables-trap')
            .doc(this.utilisateur.uid).get().then((resultat) => {
              this.responsable = resultat.data();
              this.initForm();
            });
        }
      }
    });
    this.authService.emit();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      this.getReservation(id);
      this.initForm();
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom: [this.utilisateur ? this.responsable ? this.responsable.nom : this.utilisateur.nom : '', Validators.required],
      prenom: [this.responsable ? this.responsable.prenom : '', Validators.required],
      tel: [this.responsable ? this.responsable.tel : '', Validators.required],
      email: [this.responsable ? this.responsable.email : '', Validators.required],
      numero: [this.responsable ? this.responsable.numero : '', Validators.required],
      typepiece: [this.responsable ? this.responsable.typepiece : 'cni', Validators.required],
      indicatif: [this.responsable ? this.responsable.indicatif : '+237', Validators.required]
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
    panier.forEach((reservation: Reservation) => {
      if (reservation.id === this.reservation.id) {
        newPanier.push(this.reservation);
      } else {
        newPanier.push(reservation);
      }
    });
    localStorage.setItem('panier-trap', JSON.stringify(newPanier));

    if (this.utilisateur) {
      this.reservation.utilisateur = this.utilisateur;

      const db = firebase.firestore();
      db.collection('responsables-trap')
        .doc(this.utilisateur.uid)
        .set(JSON.parse(JSON.stringify(this.reservation.responsable))).then(() => {
          db.collection('reservation-trap').doc(this.reservation.id).set(JSON.parse(JSON.stringify(this.reservation))).then(() => {
            console.log('TERMINEEE !!!');
            metro().activity.close(activity);
            this.router.navigate(['offres', 'reservation', 'recap', this.reservation.id]);
          }).catch((e) => {
            metro().activity.close(activity);
          });
        }).catch((e) => {
        });
    } else {
      const db = firebase.firestore();
      db.collection('reservation-trap').doc(this.reservation.id).set(JSON.parse(JSON.stringify(this.reservation))).then(() => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['offres', 'reservation', 'recap', this.reservation.id]);
      }).catch((e) => {
        metro().activity.close(activity);
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
