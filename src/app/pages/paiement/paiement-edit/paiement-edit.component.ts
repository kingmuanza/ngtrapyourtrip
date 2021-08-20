import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Paiement } from 'src/app/models/paiement.model';
import * as firebase from 'firebase';

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
  paiement: Paiement;
  constructor(
    private authService: AuthentificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utilisateur = this.authService.utilisateur;
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
  }

  envoiOrange() {
    console.log('envoiOrange');
    this.getAPIKeyOrange();
  }

  paiementOrange() {
    console.log('paiementOrange');
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
        this.reponseOrange = JSON.parse((xhr.responseText));
        console.log(this.reponseOrange);

        window.location.href = this.reponseOrange.payment_url;
      }
    });
    const lien = '/trapyourtripback/paiement.php?';

    // tslint:disable-next-line:max-line-length
    xhr.open('GET', lien + 'montant=' + this.TOTAL + '&token=' + this.tokenOrange.access_token + '&order_id=' + this.paiement.id);
    xhr.send();
  }

  getAPIKeyOrange() {
    this.effectuerLePaiement().then(() => {
      alert('paiement effectué !!');
    });
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
    const db = firebase.firestore();
    await db.collection('paiement-trap').doc(this.paiement.id).set(JSON.parse(JSON.stringify(this.paiement)));
    if (this.paiement.reservations && this.paiement.reservations.length > 0) {
      for (let i = 0; i < this.paiement.reservations.length; i++) {
        const reservation = this.paiement.reservations[i];
        reservation.statut = 'PAYEE';
        await db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation)));
      }
    }

  }

}
