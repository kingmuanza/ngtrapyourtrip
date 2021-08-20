import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { Agence } from 'src/app/models/agence.model';

@Component({
  selector: 'app-agence-list',
  templateUrl: './agence-list.component.html',
  styleUrls: ['./agence-list.component.scss']
})
export class AgenceListComponent implements OnInit {

  agences = new Array<Agence>();
  dtOptions = {
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  dtTrigger = new Subject();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtTrigger = new Subject();
    this.getAgences().then((agences) => {
      this.agences = agences;
      this.dtTrigger.next();
    });
  }

  getAgences(): Promise<Array<Agence>> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      const trajets = new Array<Agence>();
      db.collection('agences-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const trajet = resultat.data() as Agence;
          trajets.push(trajet);
        });
        resolve(trajets);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  supprimer(agence: Agence) {
    const oui = confirm('Etes-bous sur de voulpir supprimer ?');
    if (oui) {
      const db = firebase.firestore();
      db.collection('agences-trap').doc(agence.id).delete().then(() => {
        window.location.reload();
      });
    }
  }

  modifier(agence: Agence) {
    this.router.navigate(['offres', 'transport', 'agence', 'edit', agence.id]);
  }

}
