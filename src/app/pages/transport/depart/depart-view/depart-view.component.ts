import { Component, OnInit, ViewChild } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/models/reservation.model';
import * as firebase from 'firebase';
import { Depart } from 'src/app/models/depart.model';
import { Transport } from 'src/app/models/transport.model';
import { Trajet } from 'src/app/models/trajet.model';
import { Gare } from 'src/app/models/gare.model';
declare const metro: any;

@Component({
  selector: 'app-depart-view',
  templateUrl: './depart-view.component.html',
  styleUrls: ['./depart-view.component.scss']
})
export class DepartViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;
  @ViewChild('dialogRetour', { static: false }) dialogRetour;
  depart: Depart;
  form: FormGroup;
  heure = '00:00';
  allerretour = false;
  retourDate;
  retourHeure;
  gare: Gare;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const idgare = paramMap.get('idgare');
      const heure = paramMap.get('heure');
      if (id) {
        this.getDepart(id).then((depart) => {
          this.depart = depart;
          console.log('depart');
          console.log(depart);
          if (idgare) {
            const db = firebase.firestore();
            db.collection('gares-trap').doc(idgare).get().then((resultat) => {
              const gare = resultat.data() as Gare;
              this.gare = gare;
              this.initForm();
            }).catch((e) => {
            });
          }
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
      heure: [null, []],
      allerretour: ['allersimple'],
    });

    // tslint:disable-next-line:no-string-literal
    this.form.controls['date'].valueChanges.subscribe((value) => {
      console.log('value');
      console.log(value);
    });
    // tslint:disable-next-line:no-string-literal
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
    if (!this.retourHeure) {
      alert('Veuillez choisir une heure de retour');
      return;
    }
    console.log('this.retourDate');
    console.log(this.dialogRetour);
    const d = $(this.dialogRetour);
    console.log(this.dialogRetour);
    console.log('d');
    console.log(d);
    const date = this.calendarpickerlocale.nativeElement.value;
    const date2 = this.calendarpickerlocale2.nativeElement.value;
    console.log(date2);
    console.log('this.retourHeure');
    console.log(this.retourHeure);
    const value = this.form.value;
    const heure = value.heure;

    const ligneDate = date + 'T' + heure + ':00';
    const ligneDate2 = date2 + 'T' + this.retourHeure + ':00';
    console.log('ligneDate');
    console.log(ligneDate);
    console.log('ligneDate2');
    console.log(ligneDate2);

    const dateAller = new Date(date + 'T' + heure + ':00');
    const dateRetour = new Date(date2 + 'T' + this.retourHeure + ':00');

    if (dateAller.getTime() + 1000 < dateRetour.getTime()) {
      this.onFormSubmit();
      console.log('metro');
      console.log(metro);
      metro().dialog.close('#dialogRetour');
    } else {
      alert('La date de Retour doit être supérieure à la date d\'Aller');
    }

  }

  continuer() {
    metro().dialog.open('#dialogRetour');
    window.scrollTo(550, 550);
  }

  goToAll() {
    this.router.navigate(['offres', 'hebergement']);
  }

  getHeure(date: Date) {
    const d = new Date(date);
    const heure = d.toISOString();
    const temps = heure.split('T')[1];
    const h = temps.substring(0, 5);
    // console.log(h + 'r');
    return h;
  }

  isDateValide(): boolean {
    const value = this.form.value;
    const heure = value.heure;
    if (heure) {
      if (this.calendarpickerlocale) {
        if (this.calendarpickerlocale.nativeElement) {

          const date = this.calendarpickerlocale.nativeElement.value;
          // console.log('date');
          // console.log(date);
          const dateDebut = new Date(date + 'T' + heure + ':00');
          // console.log(dateDebut);
          if (date && new Date().getTime() <= dateDebut.getTime()) {
            return true;
          } else {
            return false;
          }
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
    const dateDebut = new Date(date + 'T' + heure + ':00');

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
      if (this.gare) {
        transport.gare = this.gare;
      }
      let cout = this.depart.prix * Number(personnes);

      if (this.allerretour) {
        transport.retour = true;
        const date2 = this.calendarpickerlocale2.nativeElement.value;
        console.log(date2);
        console.log(this.retourHeure);
        transport.dateRetour = new Date(date2 + 'T' + this.retourHeure + ':00');
        if (this.depart.prixAR) {
          cout = this.depart.prixAR * Number(personnes) * 2;
        } else {
          cout = this.depart.prix * Number(personnes) * 2;
        }
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
      // this.initForm();
      this.avertir();
    }
  }

  avertir() {
    const value = this.form.value;
    const notify = metro().notify;
    const date = this.calendarpickerlocale.nativeElement.value;
    const heure = value.heure;
    if (heure) {
      alert('La date n\'est pas valide : ' + date);
    } else {
      alert('Veuillez choisir l\'heure');
    }
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
