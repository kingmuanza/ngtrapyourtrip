import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { LocationVoiture } from 'src/app/models/location.voiture.model';
import { Reservation } from 'src/app/models/reservation.model';
import { Voiture } from 'src/app/models/voiture.model';
import { VoitureService } from 'src/app/services/voiture.service';
declare const metro: any;

@Component({
  selector: 'app-transport-location-view',
  templateUrl: './transport-location-view.component.html',
  styleUrls: ['./transport-location-view.component.scss']
})
export class TransportLocationViewComponent implements OnInit {

  @ViewChild('depart', { static: false }) departInput: ElementRef;
  @ViewChild('arrivee', { static: false }) arriveeInput: ElementRef;
  @ViewChild('ville', { static: false }) villeInput: ElementRef;

  @ViewChild('debut', { static: false }) debut;
  @ViewChild('fin', { static: false }) fin;
  @ViewChild('date', { static: false }) date;

  @ViewChild('heureDebut', { static: false }) heureDebut;

  voiture: Voiture;
  voitures = [];
  form: FormGroup;
  type = 'interurbain';

  heures = [];
  retourHeure = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private voitureService: VoitureService,
    private formBuilder: FormBuilder
  ) {
    for (let i = 0; i < 10; i++) {
      this.heures.push('0' + i + ':00');
    }
    for (let i = 10; i < 24; i++) {
      this.heures.push(i + ':00');
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      console.log(id);
      if (id) {
        this.voitureService.getVoiture(id).then((voiture) => {
          this.voiture = voiture;
        }).catch((e) => {
          console.log(e);
          console.log(id);
        });
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      ville: ['', []],
      heureDebut: ['oui', []],
      heureFin: ['oui', []],
      heure: ['oui', []],
      categorie: ['', []],
      allerretour: ['simple', []],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);

    const heureDebut = value.heureDebut;
    const heureFin = value.heureFin;
    const allerretour = value.allerretour;

    if (this.type === 'interurbain') {
      const depart = this.departInput.nativeElement.value;
      const arrivee = this.arriveeInput.nativeElement.value;
      const date = this.date.nativeElement.value;
      const heure = value.heure;

      console.log('depart');
      console.log(depart);
      console.log('arrivee');
      console.log(arrivee);
      console.log('date');
      console.log(date);

      if (depart && arrivee && date && heure) {
        const location = new LocationVoiture('interurbain', this.voiture);
        location.depart = depart;
        location.arrivee = arrivee;
        const dateDepart = new Date(date + ' ' + heure);
        if (dateDepart.getTime() - new Date().getTime() > 0) {
          location.date = dateDepart;
          location.allerretour = allerretour;
          console.log('location');
          console.log(location);
          this.reserver(location);
        } else {
          alert('Veuillez rentrer une date valide');
        }
      } else {
        alert('Veuillez remplir le formulaire de réservation');
      }
    }

    if (this.type === 'location') {
      const ville = this.villeInput.nativeElement.value;

      const debut = this.debut.nativeElement.value;
      const fin = this.fin.nativeElement.value;

      console.log('ville');
      console.log(ville);

      if (ville && debut && fin && heureDebut && heureFin) {
        const location = new LocationVoiture('location', this.voiture);
        location.ville = ville;
        location.debut = new Date(debut + ' ' + heureDebut);
        location.fin = new Date(fin + ' ' + heureDebut);
        if (location.debut.getTime() - new Date().getTime() > 0) {
          if (location.fin.getTime() - location.debut.getTime() > 0) {
            console.log('location');
            console.log(location);
            this.reserver(location);
          } else {
            alert('Veuillez rentrer une date de fin valide');
          }
        } else {
          alert('Veuillez rentrer une date de début valide');
        }
      } else {
        alert('Veuillez remplir le formulaire de réservation');
      }

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

  voir(voiture: Voiture) {
    this.router.navigate(['offres', 'transport', 'location', voiture.id]);
    this.router.navigate(['offres', 'transport', 'location', voiture.id]);
  }

  handleChange($event) {

  }

  reserver(location: LocationVoiture) {

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const reservation = new Reservation();
    reservation.locationVoiture = location;
    reservation.dateDebut = location.debut;
    reservation.dateFin = location.fin;
    if (location.type === 'location') {
      const diff = new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      reservation.cout = location.voiture.cout * days;
    }
    if (location.type === 'interurbain') {
      reservation.cout = location.voiture.cout;
    }

    const db = firebase.firestore();
    db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
      console.log('TERMINEEE !!!');
      metro().activity.close(activity);
      this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

  selectionnerHeureDebut() {
    console.log(this.heureDebut.nativeElement);
    console.log(this.heureDebut.nativeElement.click());
    this.heureDebut.nativeElement.click();
  }

  saveWithRetour() {}

}
