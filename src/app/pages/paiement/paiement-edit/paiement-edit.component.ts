import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Paiement } from 'src/app/models/paiement.model';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paiement-edit',
  templateUrl: './paiement-edit.component.html',
  styleUrls: ['./paiement-edit.component.scss']
})
export class PaiementEditComponent implements OnInit {

  reservations = [];
  tokenOrange = {
    token_type: 'Bearer',
    access_token: 'olUQCsCfyfGMGVqyU85NoiVnmJYa',
    expires_in: '7776000'
  };
  reponseOrange = {
    status: 201,
    message: 'OK',
    pay_token: 'v1hmegvfevam78sevc1xgvbnmwaxujxop5kxnfdldv8yc1mgkg2xcvra4wyg0zkh',
    payment_url: '',
    notif_token: '0iohekcwjcoszr12czertue2aatlhwx5'
  };
  TOTAL = 0;
  utilisateur: Utilisateur;
  utilisateurSubscription: Subscription;
  paiement: Paiement;
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utilisateurSubscription = this.authService.utilisateurSubject.subscribe((utilisateur: Utilisateur) => {
      this.utilisateur = utilisateur;
      console.log('this.utilisateur');
      console.log(this.utilisateur);
      if (this.utilisateur) {
        const panierString = localStorage.getItem('panier-trap');
        if (panierString) {
          this.reservations = JSON.parse(panierString);
          this.reservations.forEach((reservation: Reservation) => {
            this.TOTAL += reservation.cout;
            if (this.utilisateur) {
              reservation.utilisateur = this.utilisateur;
            }
          });
          this.paiement = new Paiement();
          this.paiement.reservations = this.reservations;
          this.paiement.total = this.TOTAL;
          this.paiement.utilisateur = this.utilisateur;
        }
      } else {
        this.router.navigate(['inscription']);
      }
    });
    this.authService.emit();
  }

  envoiOrange() {
    console.log('envoiOrange');
    this.getAPIKeyOrange();
    this.envoiMail().then(() => {
      console.log('Fin denvoi du mail');
      this.notifierParMail().then(() => {
        console.log('Fin denvoi du mail à trap');
      });
    });
  }

  envoiMail() {
    console.log('envoiMail');
    console.log(this.utilisateur);
    console.log(this.utilisateur.login);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          console.log('mail envoyé à utilisateur');
          console.log(xhr.responseText);
          resolve(xhr.responseText);
        }
      });
      const lien = '/trapyourtripback/envoi_email.php?';
      const objet = 'Votre réservation';
      let email = this.utilisateur.login;
      if (email) {
        if (email.indexOf('@') !== -1) {
        } else {
          email = this.utilisateur.email;
        }
      } else {
        email = this.utilisateur.email;
      }

      if (email) {
        console.log('email finale');
        console.log(email);
        xhr.open('GET', lien + 'email=' + email + '&objet=' + objet + '&order_id=' + this.paiement.id);
        xhr.send();
      } else {
        alert('Aucun email trouvé !');
      }
    });
  }

  notifierParMail() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          console.log('mail envoyé à trap');
          console.log(xhr.responseText);
          resolve(xhr.responseText);
        }
      });
      const lien = '/trapyourtripback/envoi_email_reservation.php?';
      let displayName = this.utilisateur.displayName;
      if (displayName) {

      } else {
        displayName = this.utilisateur.prenom + ' ' + this.utilisateur.nom;
      }
      xhr.open('GET', lien + 'nom=' + displayName + '&idreservation=' + this.reservations[0].id);
      xhr.send();
    });
  }

  paiementOrange() {
    console.log('paiementOrange');
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        console.log('Résultat du paiement Orange');
        this.reponseOrange = JSON.parse((xhr.responseText));
        console.log(this.reponseOrange);
        window.open(this.reponseOrange.payment_url);
        this.effectuerLePaiement().then(() => {
          console.log('Paiement effectué');
        });
      }
    });
    const lien = '/trapyourtripback/paiement.php?';

    // tslint:disable-next-line:max-line-length
    xhr.open('GET', lien + 'montant=' + this.TOTAL + '&token=' + this.tokenOrange.access_token + '&order_id=' + this.paiement.id);
    xhr.send();
  }

  getAPIKeyOrange() {
    console.log('getAPIKeyOrange');
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        this.tokenOrange = JSON.parse((xhr.responseText));
        console.log(this.tokenOrange);
        this.paiementOrange();
      }
    });

    xhr.open('GET', '/trapyourtripback/gettoken.php');

    xhr.send();
  }

  async effectuerLePaiement() {
    this.paiement.mode = 'OM';
    this.paiement.orangemoney = this.reponseOrange;
    const db = firebase.firestore();
    await db.collection('paiement-trap').doc(this.paiement.id).set(JSON.parse(JSON.stringify(this.paiement)));
    if (this.paiement.reservations && this.paiement.reservations.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.paiement.reservations.length; i++) {
        const reservation = this.paiement.reservations[i];
        reservation.statut = 'PAYEE';
        await db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation)));
      }
    }
  }

  toDate(str) {
    return new Date(str);
  }

}
