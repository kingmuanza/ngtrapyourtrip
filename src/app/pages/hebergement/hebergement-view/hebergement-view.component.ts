import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
import { Hebergement } from 'src/app/models/hebergement.model';
declare const metro: any;

@Component({
  selector: 'app-hebergement-view',
  templateUrl: './hebergement-view.component.html',
  styleUrls: ['./hebergement-view.component.scss']
})
export class HebergementViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;

  hebergement: Hebergement;
  form: FormGroup;
  hebergements = new Array<Hebergement>();
  HEBERGEMENTS = new Array<Hebergement>();
  resultats = new Array<Hebergement>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id).then((hebergement) => {
          this.hebergement = hebergement;
          this.getSejours();
        });
      }
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      dateFin: ['', Validators.required],
      adultes: [1, Validators.required],
      enfants: [0, Validators.required],
    });

    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
  }

  goToAll() {
    this.router.navigate(['offres', 'hebergement']);
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const adultes = value.adultes;
    const enfants = value.enfants;
    const date = this.calendarpickerlocale.nativeElement.value;
    const dateFin = this.calendarpickerlocale2.nativeElement.value;

    if (date && date.length > 2 && dateFin && dateFin.length > 2) {
      const diff = new Date(dateFin).getTime() - new Date(date).getTime();
      console.log('difefrence');
      console.log(diff);

      if (new Date(date).getTime() < new Date(dateFin).getTime()) {

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        console.log('Nombre de jours');
        console.log(days);
        const reservation = new Reservation();
        reservation.hebergement = this.hebergement;
        reservation.personnes = adultes;
        reservation.enfants = enfants;
        reservation.dateDebut = new Date(date);
        reservation.dateFin = new Date(dateFin);
        reservation.cout = this.hebergement.nuitee * days;

        console.log('reservation');
        console.log(reservation);

        const activity = metro().activity.open({
          type: 'square',
          overlayColor: '#fff',
          overlayAlpha: 0.8
        });

        const panierString = localStorage.getItem('panier-trap');
        let panier = [];
        if (panierString) {
          panier = JSON.parse(panierString);
        }
        panier.push(reservation);
        localStorage.setItem('panier-trap', JSON.stringify(panier));

        const db = firebase.firestore();
        db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
          console.log('TERMINEEE !!!');
          metro().activity.close(activity);
          this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
        }).catch((e) => {
          metro().activity.close(activity);
        });

      } else {
        const notify = metro().notify;
        notify.create('La date d\'arrivée est supérieure à la date de départ', null, {
          cls: 'alert',
          distance: '50vh',
          duration: 1000,
          timeout: 4000
        });
      }

    } else {
      const notify = metro().notify;
      notify.create('Veuillez renseigner la date', null, {
        cls: 'alert',
        distance: '50vh',
        timeout: 4000,
        duration: 1000
      });
    }

  }

  getSejour(id: string): Promise<Hebergement> {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').doc(id).get().then((resultat) => {
        const hebergement = resultat.data() as Hebergement;
        console.log('TERMINEEE !!!');
        console.log(this.hebergement);
        resolve(hebergement);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(255, 115, 0);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(255, 115, 0);"></span>';
    }
    return stars;
  }

  getSejours() {
    this.hebergements = new Array<Hebergement>();
    this.resultats = new Array<Hebergement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const hebergement = resultat.data() as Hebergement;
          if (!hebergement.options) {
            hebergement.options = {
              wifi: false,
              plage: false,
              piscine: false,
              climatiseur: false,
              parking: false,
              petitdej: false,
              gardien: false,
            };
            hebergement.options.parking = hebergement.parking;
            hebergement.options.wifi = hebergement.wifi;
          }
          if (hebergement.id !== this.hebergement.id) {
            this.hebergements.push(hebergement);
            this.resultats.push(hebergement);
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.hebergements);
        resolve(this.hebergements);
      }).catch((e) => {
        reject(e);
      });
    });
  }

}
