import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { Gare } from 'src/app/models/gare.model';

@Component({
  selector: 'app-gare-list',
  templateUrl: './gare-list.component.html',
  styleUrls: ['./gare-list.component.scss']
})
export class GareListComponent implements OnInit {

  gares = new Array<Gare>();
  dtOptions = {
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  dtTrigger = new Subject();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtTrigger = new Subject();
    this.getGares().then((gares) => {
      this.gares = gares;
      this.dtTrigger.next();
    });
  }

  getGares(): Promise<Array<Gare>> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      const trajets = new Array<Gare>();
      db.collection('gares-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const trajet = resultat.data() as Gare;
          trajets.push(trajet);
        });
        resolve(trajets);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  supprimer(gare: Gare) {
    const oui = confirm('Etes-bous sur de voulpir supprimer ?');
    if (oui) {
      const db = firebase.firestore();
      db.collection('gares-trap').doc(gare.id).delete().then(() => {
        window.location.reload();
      });
    }
  }

  modifier(gare: Gare) {
    this.router.navigate(['offres', 'transport', 'gare', 'edit', gare.id]);
  }

}
