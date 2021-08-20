import { Component, HostListener, OnInit } from '@angular/core';
import { Trajet } from 'src/app/models/trajet.model';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Depart } from 'src/app/models/depart.model';
import { Transport } from 'src/app/models/transport.model';

@Component({
  selector: 'app-depart-list',
  templateUrl: './depart-list.component.html',
  styleUrls: ['./depart-list.component.scss']
})
export class DepartListComponent implements OnInit {

  departs = new Array<Depart>();
  trajet: Trajet;
  resultats = new Array<Transport>();

  dtOptions = {
    language: DATATABLES_OPTIONS_LANGUAGE,
    responsive: true
  };
  dtTrigger = new Subject();

  filtersShowed = false;
  recherchesShowed = false;
  screenHeight: number;
  screenWidth: number;
  mobile = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getTrajet(id);
        this.getDeparts(id);
      }
    });
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
      this.filtersShowed = true;
      this.recherchesShowed = true;
      this.dtOptions = {
        language: DATATABLES_OPTIONS_LANGUAGE,
        responsive: false
      };
    }
  }

  getTrajet(id: string) {
    const db = firebase.firestore();
    db.collection('trajets-trap').doc(id).get().then((resultat) => {
      const trajet = resultat.data() as Trajet;
      this.trajet = trajet;
    }).catch((e) => {
    });
  }

  getDeparts(id: string) {
    this.dtTrigger = new Subject();
    const db = firebase.firestore();
    db.collection('departs-trap').where('trajet.id', '==', id).get().then((resultats) => {
      resultats.forEach((resultat) => {
        const depart = resultat.data() as Depart;
        this.departs.push(depart);
      });
      this.dtTrigger.next();
    }).catch((e) => {
    });
  }

  reservation(depart: Depart, heure: string) {
    if (heure) {
      const temps = heure.split('T')[1];
      const h = temps.substr(0, 5);
      this.router.navigate(['offres', 'transport', 'depart', 'view', depart.id, h]);
    } else {
      this.router.navigate(['offres', 'transport', 'depart', 'view', depart.id, '00:01']);
    }
  }

  description(trajet: Trajet) {
    if (trajet) {
      if (trajet.villeArrivee === trajet.villeDepart) {
        return 'location de voiture : ' + trajet.villeArrivee;
      } else {
        return trajet.villeDepart + ' - ' + trajet.villeArrivee;
      }
    } else {
      return '';
    }

  }

  alerter(mot) {
    alert('oui');
  }
}
