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
import { environment } from '../../../environments/environment';
declare const metro: any;
declare var CinetPay: any;

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

  lienback = '';
  returnURL = '';
  cancelURL = '';
  notifyURL = '';
  lienStripe = '';

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService,
    private http: HttpClient,
  ) {

    console.log('environment.lienback');
    console.log(environment.lienback);
    this.lienback = environment.lienback;
    this.returnURL = environment.lienback + 'trapyourtripback/return.php';
    this.cancelURL = environment.lienback + 'trapyourtripback/return.php';
    this.notifyURL = environment.lienback + 'trapyourtripback/return.php';
    this.lienStripe = environment.lienback + 'stripe/index.php';
    console.log('CinetPay');
    console.log(CinetPay);

  }

  private async sauvegarderPaiementEtenvoyerEmail() {

    this.initPaiementItem();

    await this.savePaiement(this.paiement);
    console.log('paiement sauvegardé');

    const responsable = {
      noms: this.utilisateur.displayName,
      email: this.utilisateur.email,
    };
    const response = await this.envoyerMailConfirmation(responsable);
    console.log('response');
    console.log(response);
  }

  private initPaiementItem() {
    this.paiement.reservations = this.reservations;
    this.paiement.total = this.TOTAL;
    this.paiement.mode = 'CINETPAY';
    this.paiement.date = new Date();
    this.paiement.utilisateur = this.authService.utilisateur;
    this.paiement.statut = 1;
    console.log(' this.paiement');
    console.log(this.paiement);
  }

  paiementCinetPay() {
    this.initPaiementItem();
    const muanza = CinetPay.setConfig({
      apikey: '14805067945e0b6eb3374f47.48751476',
      site_id: '962769',
      mode: 'PRODUCTION',
      notify_url: 'https://mondomaine.com/notify/',
      device_id: '',
      type: ''
    });
    console.log('muanza');
    console.log(muanza);
    const nom = 'Muanza';
    const prenom = 'Muanza';
    const email = 'muanza.kangudie@gmail.com';
    const tel = '696543495';

    const data = {
      transaction_id: this.paiement.id,
      amount: 100,
      // amount: this.TOTAL,
      currency: 'XAF',
      channels: 'ALL',
      description: 'YOUR_PAYMENT_DESCRIPTION',
      customer_name: nom ? nom : '',
      customer_surname: prenom ? prenom : '',
      customer_email: email ? email : '',
      customer_phone_number: tel ? tel : '',
      customer_address: 'BP 0024',
      customer_city: 'Antananarivo',
      customer_country: 'CM',
      customer_state: 'CM',
      customer_zip_code: '06510', // code postal
    };

    console.log('data');
    console.log(data);

    console.log('getCheckout');
    CinetPay.getCheckout(data);

    CinetPay.waitResponse((donnees: any) => {
      console.log('donnees');
      console.log(donnees);
      if (donnees.status === 'REFUSED') {
        alert('Votre paiement a échoué');
        window.location.reload();
      } else if (donnees.status === 'ACCEPTED') {
        alert('Votre paiement a été effectué avec succès');
        this.initPaiementItem();
        this.paiement.statut = 4;
        this.savePaiement(this.paiement).then(() => {
          console.log('paiement sauvegardé');
          if (this.utilisateur.email) {
            const responsable = {
              noms: this.utilisateur.displayName,
              email: this.utilisateur.email,
            };
            this.envoyerMailConfirmation(responsable).then((response) => {
              console.log('response');
              console.log(response);
              this.router.navigate(['return', this.paiement.id]).then(() => {
                window.location.reload();
              });
            });
          } else {
            alert('Vous ne disposez pas d\'addresse mail dans votre profil');
            this.router.navigate(['return', this.paiement.id]).then(() => {
              window.location.reload();
            });
          }

        }).catch((e) => {
          alert(e);
        });
      }
    });

    CinetPay.onError((donnees) => {
      console.log('donnees');
      console.log(donnees);
    });
  }

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

  envoyerMailConfirmation(responsable) {
    return new Promise((resolve, reject) => {
      console.log('envoyerMailConfirmation');
      const noms = responsable.noms;
      this.http.get(this.lienback + 'trapyourtripback/sendmail.php?email=' + responsable.email + '&noms=' + noms)
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

}
