import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Transport } from 'src/app/models/transport.model';
declare const metro: any;

@Component({
  selector: 'app-accueil-transports',
  templateUrl: './accueil-transports.component.html',
  styleUrls: ['./accueil-transports.component.scss']
})
export class AccueilTransportsComponent implements OnInit {

  transports = new Array<Transport>();
  constructor() { }

  ngOnInit(): void {
    this.getTransports();
  }

  getTransports() {
    this.transports = new Array<Transport>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 1
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('transports-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const transport = resultat.data() as Transport;
          this.transports.push(transport);
        });
        console.log('TERMINEEE !!!');
        console.log(this.transports);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }
}
