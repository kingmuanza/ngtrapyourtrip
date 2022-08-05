import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Paiement } from 'src/app/models/paiement.model';
import { PanierService } from 'src/app/services/panier.service';
declare const metro: any;

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {

  paiement: Paiement;

  constructor(
    private route: ActivatedRoute,
    private panierService: PanierService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getPaiement(id).then((paiement) => {
          this.paiement = paiement;
          this.setPaiement().then(() => {
            localStorage.setItem('panier-trap', JSON.stringify([]));
            this.panierService.reservations = [];
            this.panierService.emit();
          });
        });
      }
    });
  }

  getPaiement(id: string): Promise<Paiement> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('paiement-trap').doc(id).get().then((resultat) => {
        const paiement = resultat.data() as Paiement;
        resolve(paiement);
      }).catch((e) => {
      });
    });
  }

  setPaiement() {
    this.paiement.statut = 4;
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('paiement-trap').doc(this.paiement.id).set(JSON.parse(JSON.stringify(this.paiement)))
        .then(() => {
          resolve(this.paiement);
        }).catch((e) => {
        });
    });
  }

}
