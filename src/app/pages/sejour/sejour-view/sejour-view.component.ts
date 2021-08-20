import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
import { HostListener } from '@angular/core';
declare const metro: any;

@Component({
  selector: 'app-sejour-view',
  templateUrl: './sejour-view.component.html',
  styleUrls: ['./sejour-view.component.scss']
})
export class SejourViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  sejour: Sejour;
  form: FormGroup;
  formReservationShowed = false;

  filtersShowed = false;
  recherchesShowed = false;
  screenHeight: number;
  screenWidth: number;
  mobile = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id);
      }
    });
    this.initForm();
    this.getScreenSize();
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      personnes: [1, Validators.required]
    });

    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
  }

  showFormReservation() {
    this.formReservationShowed = !this.formReservationShowed;
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
      this.formReservationShowed = true;
    }
  }

  onFormSubmit() {
    this.formReservationShowed = false;
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const personnes = value.personnes;
    let date = this.calendarpickerlocale.nativeElement.value;
    if (date && date.length > 2) {

      const reservation = new Reservation();
      reservation.sejour = this.sejour;
      reservation.personnes = personnes;
      if (this.sejour.dateDebut) {
        if (new Date( this.sejour.dateDebut).getTime() > new Date().getTime()) {
          date = this.sejour.dateDebut;
        }
      }
      reservation.dateDebut = new Date(date);
      reservation.dateFin = new Date(this.sejour.dateFin);
      reservation.cout = this.sejour.prixUnitaire * personnes;

      console.log('reservation');
      console.log(reservation);

      if (
        reservation.dateDebut &&
        reservation.dateFin &&
        reservation.dateDebut.getTime() > new Date().getTime()) {

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
        const notify = metro().notify;
        notify.create('Les dates ne sont pas valides', null, {
          cls: 'alert',
          keepOpen: false
        });
      }
    } else {
      const notify = metro().notify;
      notify.create('Veuillez renseigner la date', null, {
        cls: 'alert',
        keepOpen: false
      });
    }

  }

  getSejour(id: string) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('sejours-trap').doc(id).get().then((resultat) => {
        const sejour = resultat.data() as Sejour;
        this.sejour = sejour;
        console.log('TERMINEEE !!!');
        console.log(this.sejour);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
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

  goToAll() {
    this.router.navigate(['offres', 'sejour']);
  }

  modifier(sejour) {
    this.router.navigate(['offres', 'sejour', 'edit', sejour.id]);
  }

  supprimer(element) {
    const oui = confirm('Etes vous sûr de vouloir supprimer ce jour ?');
    const db = firebase.firestore();
    if (oui) {
      db.collection('sejours-trap').doc(element.id).delete().then(() => {
        this.router.navigate(['offres', 'sejour']);
      });
    }
  }

}
