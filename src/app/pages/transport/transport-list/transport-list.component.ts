import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Transport } from 'src/app/models/transport.model';
declare const metro: any;

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.scss']
})
export class TransportListComponent implements OnInit {

  transports = new Array<Transport>();
  resultats = new Array<Transport>();
  recherche = '';
  ordre = 'croissant';
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getTransports();
  }

  ouvrir(id) {
    this.router.navigate(['transport', 'view', id]);
  }

  getTransports() {
    this.transports = new Array<Transport>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('transports-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const transport = resultat.data() as Transport;
          this.transports.push(transport);
          this.resultats.push(transport);
        });
        console.log('TERMINEEE !!!');
        console.log(this.transports);
        metro().activity.close(activity);
        this.ordonner(this.ordre);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

  rechercher(ev) {
    console.log(ev);
    this.resultats = this.transports;
    if (ev) {
      this.resultats = this.resultats.filter((transport) => {
        return transport.description.toLowerCase().indexOf(ev) !== -1;
      });
    }
  }

  ordonner(ev) {
    console.log(ev);
    if (ev === 'croissant') {
      this.resultats.sort((a, b) => {
        return a.prixUnitaire - b.prixUnitaire > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.prixUnitaire - b.prixUnitaire > 0 ? -1 : 1;
      });
    }
  }

}
