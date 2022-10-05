import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier.service';
import { Subscription } from 'rxjs';
import { Trajet } from 'src/app/models/trajet.model';
import { NgForm } from '@angular/forms';
import { Paiement } from 'src/app/models/paiement.model';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import * as stripe from '@stripe/stripe-js';
declare const metro: any;

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
  paiement = new Paiement();
  responsables = new Array<any>();
  reservationsGroupes = {};
  utilisateur: any;

  laCarte: stripe.StripeCardElement;
  dataStripe: any;
  stripeInstanceResut: stripe.Stripe;
  stripeErrorMessage: string;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.authService.utilisateur) {
      this.isUser = true;
      this.utilisateur = this.authService.utilisateur;
    } else {
      this.isUser = false;
    }
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations;
      this.update();
    });
    this.panierService.getPanier();
  }

  update() {
    this.TOTAL = 0;
    this.reservations.forEach((reservation: Reservation) => {
      this.TOTAL += reservation.cout;
      if (reservation.responsable) {
        if (reservation.responsable.email) {
          if (this.reservationsGroupes[reservation.responsable.email]) {
            this.reservationsGroupes[reservation.responsable.email].reservations.push(reservation);
          } else {
            this.reservationsGroupes[reservation.responsable.email] = {
              noms: reservation.responsable.nom + ' ' + reservation.responsable.prenom,
              reservations: [reservation]
            };
          }
        }
      }
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
      this.update();
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

  savePaiement(paiement: Paiement): Promise<Paiement> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('paiement-trap').doc(paiement.id).set(JSON.parse(JSON.stringify(paiement))).then(() => {
        resolve(paiement);
      }).catch((e) => {
      });
    });
  }

  async payerMobile(form) {
    await this.sauvegarderPaiementEtenvoyerEmail();
    form.submit();
  }

  async payerBancaire(form) {
    // await this.sauvegarderPaiementEtenvoyerEmail();
    console.log(form);
    form.submit();
  }

  private async sauvegarderPaiementEtenvoyerEmail() {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    this.paiement.reservations = this.reservations;
    this.paiement.total = this.TOTAL;
    this.paiement.mode = 'CINETPAY';
    this.paiement.date = new Date();
    this.paiement.utilisateur = this.authService.utilisateur;
    this.paiement.statut = 1;
    console.log(' this.paiement');
    console.log(this.paiement);
    setTimeout(() => {
      console.log(' setTimeout metro().activity.close(activity)');
      if (activity && metro().activity) {
        metro().activity.close(activity);
      }
    }, 10000);
    await this.savePaiement(this.paiement);
    console.log('paiement sauvegardé');
    console.log(this.reservationsGroupes);
    const keys = Object.keys(this.reservationsGroupes);
    console.log('keys');
    console.log(keys);
    if (keys.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const responsable = {
          noms: this.reservationsGroupes[key].noms,
          email: key,
        };
        const response = await this.envoyerMailConfirmation(responsable);
      }
    }
    metro().activity.close(activity);
  }

  envoyerMailConfirmation(responsable) {
    return new Promise((resolve, reject) => {
      console.log('envoyerMailConfirmation');
      const noms = responsable.noms;
      this.http.get('https://trapyourtrip.com/trapyourtripback/sendmail.php?email=' + responsable.email + '&noms=' + noms)
        /* this.http.get('trapyourtripback/sendmail.php?email=' + responsable.email + '&noms=' + noms) */
        .subscribe((response) => {
          console.log('response');
          console.log(response);
          resolve(response);
        }, (error) => {
          console.log('error');
          console.log(error);
          reject(error);
        });
    });
  }

  paiementStripe() {
    window.location.href = 'http://www.trapyourtrip.com/stripe';
  }

  paiementParCarte() {
    console.log('Nous montons la carte');
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    const stripeInstance = stripe.loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        this.dataStripe = JSON.parse(xhr.responseText);

        stripeInstance.then((stripeInstanceResut) => {
          this.stripeInstanceResut = stripeInstanceResut;
          const elements = stripeInstanceResut.elements();
          const leStyle = {
            base: {
              color: '#32325d',
              fontFamily: 'Arial, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#32325d'
              }
            },
            invalid: {
              fontFamily: 'Arial, sans-serif',
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          };
          this.laCarte = elements.create('card', { style: leStyle });
          this.laCarte.mount('#cardElement');
          console.log('La carte a été montée');
          console.log(this.laCarte);
        });
      }
    });

    xhr.open('GET', 'this.globalService.ADRESSE_SERVEUR_BACKEND' + 'stripe/create-payment-intent');

    xhr.send();
  }

  payerParStripeVraiVrai(laCarte, data) {
    console.log('laCarte');
    console.log(laCarte);
    console.log('data');
    console.log(data);
    this.stripeInstanceResut.confirmCardPayment(
      data.clientSecret,
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payment_method: {
          card: laCarte
        }
      }
    ).then((result) => {
      console.log('Le résulat esst le suivant');
      console.log(result);
      if (result.error) {
        // Show error to your customer
        console.log(result.error.message);
        this.stripeErrorMessage = result.error.message;
      } else {
        // The payment succeeded!
        const paymentIntentId = result.paymentIntent.id;
        console.log('paymentIntentId');
        console.log(paymentIntentId);
        // const lien = 'https://dashboard.stripe.com/test/payments/' + paymentIntentId;
        // window.open(lien);
      }
    });
  }

}
