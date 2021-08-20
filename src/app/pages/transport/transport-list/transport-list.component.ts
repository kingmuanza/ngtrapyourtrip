import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Transport } from 'src/app/models/transport.model';
import { Trajet } from 'src/app/models/trajet.model';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare const metro: any;

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.scss']
})
export class TransportListComponent implements OnInit {

  @ViewChild('depart', { static: false }) departInput: ElementRef;
  @ViewChild('arrivee', { static: false }) arriveeInput: ElementRef;

  transports = new Array<Transport>();
  trajets = new Array<Trajet>();
  resultats = new Array<Transport>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  form2: FormGroup;

  dtOptions = {
    language: DATATABLES_OPTIONS_LANGUAGE
  };
  dtTrigger = new Subject();

  resultatsVisible = true;

  type = 'interurbain';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getTransports();

    this.dtTrigger = new Subject();
    this.getTrajets().then((trajets) => {
      this.trajets = trajets;
      this.dtTrigger.next();
    });
    this.initForm();
  }

  handleChange(ev) {
    console.log('ev');
    console.log(ev.target.value);
  }

  initForm() {
    this.form = this.formBuilder.group({
      depart: ['', [Validators.required]],
      arrivee: ['', [Validators.required]],
    });
    this.form2 = this.formBuilder.group({
      ville: ['Douala'],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log(this.departInput.nativeElement);
    console.log(this.departInput.nativeElement.value);
    console.log(this.arriveeInput.nativeElement);
    console.log(this.arriveeInput.nativeElement.value);

    const depart = this.departInput.nativeElement.value;
    const arrivee = this.arriveeInput.nativeElement.value;

    if (depart && arrivee) {
      this.dtTrigger = new Subject();
      this.getTrajets().then((trajets) => {
        if (trajets && trajets.length > 0) {
          console.log('les trjats ont été récupéres');
          this.trajets = this.trierResultatsInterUrbain(depart, arrivee, trajets);
          this.dtTrigger.next();
          this.resultatsVisible = true;
          if (this.trajets && this.trajets.length > 0) {
            this.departs(this.trajets[0]);
          } else {
            console.log('Nous n\'effectuons pas ce trajet !');
            console.log(this.trajets);
            this.avertir('Nous n\'effectuons pas ce trajet !');
          }
        } else {
          console.log('Il n\'y a mm dabord auccun trajet ');
        }
      }).catch((e) => {
        console.log('erreur');
        console.log(e);
      });
    } else {
      alert('Veuillez définir les destinations');
    }
  }

  avertir(message) {
    const notify = metro().notify;
    notify.create(message, null, {
      cls: 'alert notify-marge',
      keepOpen: false,
      position: 'bottom right',
      elementPosition: 'bottom right',
      globalPosition: 'bottom right',
    });
  }

  onFormSubmit2() {
    const value = this.form2.value;
    console.log('value');
    console.log(value);

    const ville = value.ville;

    this.dtTrigger = new Subject();
    this.getTrajets().then((trajets) => {
      this.trajets = this.trierLocation(ville, trajets);
      this.dtTrigger.next();
      if (trajets.length > 0) {
        const trajet = trajets[0];
        this.departs(trajet);
      }
    });
  }

  trierLocation(ville: string, trajets: Array<Trajet>): Array<Trajet> {
    console.log('ville de loaction');
    console.log(ville);
    let resultats = new Array<Trajet>();
    resultats = trajets;
    if (ville) {
      resultats = trajets.filter((trajet) => {
        if (trajet.villeArrivee.toLowerCase() === ville.toLowerCase()) {
          if (trajet.villeDepart.toLowerCase() === ville.toLowerCase()) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    }
    return resultats;
  }

  trierResultatsInterUrbain(depart: string, arrivee: string, trajets: Array<Trajet>): Array<Trajet> {
    let resultats = new Array<Trajet>();
    resultats = trajets;
    if (depart && arrivee) {
      resultats = trajets.filter((trajet) => {
        if (trajet.villeArrivee.toLowerCase() === arrivee.toLowerCase()) {
          if (trajet.villeDepart.toLowerCase() === depart.toLowerCase()) {
            return true;
          }
        }
      });
      return resultats;
    }
    if (depart) {
      resultats = trajets.filter((trajet) => {

        if (trajet.villeDepart.toLowerCase() === depart.toLowerCase()) {
          return true;
        }

      });
      return resultats;
    }
    if (arrivee) {
      resultats = trajets.filter((trajet) => {
        if (trajet.villeArrivee.toLowerCase() === arrivee.toLowerCase()) {
          return true;
        }
      });
      return resultats;
    }
    return resultats;

  }

  ouvrir(id) {
    this.router.navigate(['transport', 'view', id]);
  }

  getTrajets(): Promise<Array<Trajet>> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      const trajets = new Array<Trajet>();
      db.collection('trajets-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const trajet = resultat.data() as Trajet;
          trajets.push(trajet);
        });
        resolve(trajets);
      }).catch((e) => {
        reject(e);
      });
    });
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

  trajet() {
    this.router.navigate(['offres', 'transport', 'trajet', 'edit']);
  }

  agence() {
    this.router.navigate(['offres', 'transport', 'agence', 'edit']);
  }

  agences() {
    this.router.navigate(['offres', 'transport', 'agence']);
  }

  lesdepart() {
    console.log('depaaaart');
    this.router.navigate(['offres', 'transport', 'depart', 'edit']);
  }

  departs(trajet: Trajet) {
    this.router.navigate(['offres', 'transport', 'depart', 'list', trajet.id]);
  }

  supprimer(trajet: Trajet) {
    const oui = confirm('Etes-bous sur de voulpir supprimer ?');
    if (oui) {
      const db = firebase.firestore();
      db.collection('trajets-trap').doc(trajet.id).delete().then(() => {
        window.location.reload();
      });
    }
  }

  modifier(trajet: Trajet) {
    this.router.navigate(['offres', 'transport', 'trajet', 'edit', trajet.id]);
  }

}
