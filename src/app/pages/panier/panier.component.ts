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
import { Utilisateur } from 'src/app/models/utilisateur.model';
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
  utilisateurSubscription: Subscription;

  laCarte: stripe.StripeCardElement;
  dataStripe: any;
  stripeInstanceResut: stripe.Stripe;
  stripeErrorMessage: string;

  lienback = '';
  returnURL = '';
  cancelURL = '';
  notifyURL = '';
  lienStripe = '';

  pagechargeeInterval: any;

  responsable: any;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private panierService: PanierService,
    private http: HttpClient,
  ) {

    console.log('environment.lienback');
    console.log(environment.lienback);
    this.lienback = environment.lienback;
    this.lienback = 'https://trapyourtrip.com/';
    this.returnURL = environment.lienback + 'trapyourtripback/return.php';
    this.cancelURL = environment.lienback + 'trapyourtripback/return.php';
    this.notifyURL = environment.lienback + 'trapyourtripback/return.php';
    // this.lienStripe = this.lienback + 'stripe/index.php';
    this.lienStripe = 'https://trapyourtrip.com/' + 'stripe/index.php';
    console.log('CinetPay');
    console.log(CinetPay);

  }

  ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
    });
    if (this.authService.utilisateur) {
      this.isUser = true;
      this.utilisateur = this.authService.utilisateur;
    } else {
      this.isUser = false;
    }
    this.panierSubscription = this.panierService.panierSubject.subscribe((reservations) => {
      this.reservations = reservations.filter((reservation) => {
        return reservation.responsable;
      });
      this.update();
    });
    this.panierService.getPanier();
  }

  private async sauvegarderPaiementEtenvoyerEmail() {
    console.log('sauvegarderPaiementEtenvoyerEmail');
    /*
        metro().dialog.create({
          title: 'Vérifier vos mails',
          content: 'Un email de confirmation vous sera envoyé. regardez dans vos spams s\'il n\'apparait pas dans votre boîte principale',
          closeButton: true
        });
     */
    this.initPaiementItem();

    await this.savePaiement(this.paiement);
    console.log('paiement sauvegardé');

    console.log('this.reservations[0]');
    console.log(this.reservations[0]);

    const lesnoms = this.reservations[0].responsable.nom + ' ' + this.reservations[0].responsable.prenom;
    console.log('lesnoms');
    console.log(lesnoms);

    const responsable = {
      noms: lesnoms,
      email: this.reservations[0].responsable.email,
    };
    const response = await this.envoyerMailConfirmation(responsable);
    console.log('response');
    console.log(response);

  }

  private initPaiementItem() {
    console.log('initPaiementItem');
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

    let nom = this.reservations[0].responsable.displayName;

    if (this.reservations[0].responsable.nom && !this.reservations[0].responsable.displayName) {
      nom = this.reservations[0].responsable.nom;
      if (this.reservations[0].responsable.prenom) {
        nom += ' ' + this.reservations[0].responsable.prenom;
      }
    }
    if (this.reservations[0].responsable.displayName) {
      nom = this.reservations[0].responsable.displayName;
    }

    const prenom = 'Muanza';
    let mail = 'muanza.kangudie@gmail.com';
    if (this.reservations[0].responsable.email) {
      mail = this.reservations[0].responsable.email;
    } else {
      mail = this.paiement.reservations[0].responsable.email;
    }
    const tel = '696543495';

    const data = {
      transaction_id: this.paiement.id,
      amount: this.TOTAL,
      // amount: 100,
      currency: 'XAF',
      channels: 'ALL',
      description: 'YOUR_PAYMENT_DESCRIPTION',
      customer_name: nom ? nom : '',
      customer_surname: '',
      customer_email: mail,
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

    this.pagechargeeInterval = setInterval(() => {
      const cpclose = document.getElementById('cp-close');
      console.log(new Date().getTime());
      console.log('cpclose');
      console.log(cpclose);
      if (cpclose) {
        clearInterval(this.pagechargeeInterval);
        document.getElementById('cp-close').addEventListener('click', (() => {
          console.log('jai fermé cinetpay');
          window.location.reload();
        }));
      }
    }, 5000);

    CinetPay.waitResponse((donnees: any) => {
      console.log('donnees');
      console.log(donnees);
      if (donnees.status === 'REFUSED') {
        alert('Votre paiement a été refusé. Veuillez réessayer !!');
        window.location.reload();
      } else if (donnees.status === 'ACCEPTED') {
        alert('Votre paiement a été effectué avec succès');
        this.initPaiementItem();
        this.paiement.statut = 4;
        this.savePaiement(this.paiement).then(() => {
          console.log('paiement sauvegardé');
          if (this.reservations[0].responsable.email) {
            const responsable = {
              noms: this.reservations[0].responsable.displayName,
              email: mail,
            };
            this.envoyerMailConfirmation(responsable).then((response) => {
              console.log('response');
              console.log(response);
              this.router.navigate(['return', this.paiement.id]).then(() => {
                // window.location.reload();
              });
            });
          } else {
            console.log('Vous ne disposez pas d\'addresse mail dans votre profil');
            this.router.navigate(['return', this.paiement.id]).then(() => {
              // window.location.reload();
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
    console.log('savePaiement');
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('paiement-trap').doc(paiement.id).set(JSON.parse(JSON.stringify(paiement))).then(() => {
        resolve(paiement);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  async payerMobile(form) {

    if (this.reservations[0].responsable) {
      this.responsable = this.reservations[0].responsable;
      console.log('payerMobile');
      await this.sauvegarderPaiementEtenvoyerEmail();
      console.log('form');
      console.log(form);
      form.submit();
    } else {
      alert('Une de vos reservations ne contient pas de responsable');
    }
  }

  async payerBancaire(form) {
    await this.sauvegarderPaiementEtenvoyerEmail();
    console.log(form);
    form.submit();
  }

  envoyerMailConfirmation(responsable) {
    return new Promise((resolve, reject) => {
      console.log('envoyerMailConfirmation');
      const noms = responsable.nom + ' ' + responsable.prenom;
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
