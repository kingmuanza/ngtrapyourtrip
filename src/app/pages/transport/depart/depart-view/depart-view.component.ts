import { Component, OnInit, ViewChild } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import * as firebase from 'firebase';
import { Depart } from 'src/app/models/depart.model';
import { Transport } from 'src/app/models/transport.model';
import { Trajet } from 'src/app/models/trajet.model';
declare const metro: any;

@Component({
  selector: 'app-depart-view',
  templateUrl: './depart-view.component.html',
  styleUrls: ['./depart-view.component.scss']
})
export class DepartViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;
  depart: Depart;
  form: FormGroup;
  heure = '00:00';
  allerretour = false;
  retourDate;
  retourHeure;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const heure = paramMap.get('heure');
      if (id) {
        this.getDepart(id).then((depart) => {
          this.depart = depart;
          console.log('depart');
          console.log(depart);
        });
      }
      if (heure) {
        this.heure = heure;
        this.initForm();
      }
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: [''],
      personnes: [1, Validators.required],
      heure: [null, [Validators.required]],
      allerretour: ['allersimple'],
    });

    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
    this.form.controls['allerretour'].valueChanges.subscribe((value) => {
      console.log('allerretour');
      console.log(value);
      if (value === 'allerretour') {
        this.allerretour = true;
      } else {
        this.allerretour = false;
      }
    });
  }

  saveWithRetour() {
    console.log('this.retourDate');
    const date = this.calendarpickerlocale.nativeElement.value;
    const date2 = this.calendarpickerlocale2.nativeElement.value;
    console.log(date2);
    console.log('this.retourHeure');
    console.log(this.retourHeure);
    const value = this.form.value;
    const heure = value.heure;

    const dateAller = new Date(date + ' ' + heure);
    const dateRetour = new Date(date2 + ' ' + this.retourHeure);

    if (dateAller.getTime() < dateRetour.getTime()) {
      this.onFormSubmit();
    } else {
      alert('La date de Retour doit être supérieure à la date d\'Aller');
    }

  }

  goToAll() {
    this.router.navigate(['offres', 'hebergement']);
  }

  getHeure(date: Date) {
    const d = new Date(date);
    const heure = d.toISOString();
    const temps = heure.split('T')[1];
    const h = temps.substr(0, 5);
    return h;
  }

  isDateValide(): boolean {
    const value = this.form.value;
    const heure = value.heure;
    if (this.calendarpickerlocale) {
      if (this.calendarpickerlocale.nativeElement) {

        const date = this.calendarpickerlocale.nativeElement.value;
        const dateDebut = new Date(date + ' ' + heure);
        if (date && new Date().getTime() < dateDebut.getTime()) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const personnes = value.personnes;
    const heure = value.heure;
    const reservation = new Reservation();

    const date = this.calendarpickerlocale.nativeElement.value;
    const dateDebut = new Date(date + ' ' + heure);

    console.log('date de retour');
    console.log(date);
    console.log(heure);
    console.log(dateDebut);

    if (this.isDateValide()) {

      console.log('dateDebut');
      console.log(dateDebut);

      const transport = new Transport();
      transport.date = dateDebut;
      transport.depart = this.depart;
      transport.personnes = personnes;
      let cout = this.depart.prix * Number(personnes);

      if (this.allerretour) {
        transport.retour = true;
        const date2 = this.calendarpickerlocale2.nativeElement.value;
        console.log(date2);
        console.log(this.retourHeure);
        transport.dateRetour = new Date(date2 + ' ' + this.retourHeure);
        cout = cout * 2;
      }

      reservation.dateDebut = dateDebut;
      reservation.cout = cout;
      reservation.transport = transport;
      reservation.personnes = personnes;

      const panierString = localStorage.getItem('panier-trap');
      let panier = [];
      if (panierString) {
        panier = JSON.parse(panierString);
      }
      panier.push(reservation);
      localStorage.setItem('panier-trap', JSON.stringify(panier));

      const activity = metro().activity.open({
        type: 'square',
        overlayColor: '#fff',
        overlayAlpha: 0.8
      });

      const db = firebase.firestore();
      db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
        console.log('TERMINEEE !!!');
        metro().activity.close(activity);
        this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    } else {
      this.initForm();
      this.avertir();
    }
  }

  avertir() {
    const notify = metro().notify;
    notify.create('La date n\'est pas valide', null, {
      cls: 'alert notify-marge',
      keepOpen: false,
      position: 'bottom right',
      elementPosition: 'bottom right',
      globalPosition: 'bottom right',
    });
  }

  getDepart(id: string): Promise<Depart> {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('departs-trap').doc(id).get().then((resultat) => {
        const depart = resultat.data() as Depart;
        resolve(depart);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(48, 164, 221);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(48, 164, 221);"></span>';
    }
    return stars;
  }

  description(trajet: Trajet) {
    if (trajet) {
      if (trajet.villeArrivee === trajet.villeDepart) {
        return 'Location de voiture : ' + trajet.villeArrivee;
      } else {
        return trajet.villeDepart + ' - ' + trajet.villeArrivee;
      }
    } else {
      return '';
    }
  }

  modifier() {
    this.router.navigate(['offres', 'transport', 'depart', 'edit', this.depart.id]);
  }

}
