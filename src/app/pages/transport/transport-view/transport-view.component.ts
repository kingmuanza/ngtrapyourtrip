import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Transport } from 'src/app/models/transport.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
declare const metro: any;

@Component({
  selector: 'app-transport-view',
  templateUrl: './transport-view.component.html',
  styleUrls: ['./transport-view.component.scss']
})
export class TransportViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  transport: Transport;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getTransport(id);
      }
    });
    this.initForm();
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

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const personnes = value.personnes;
    const date = this.calendarpickerlocale.nativeElement.value;
    if (date && date.length > 2) {

      const reservation = new Reservation();
      reservation.transport = this.transport;
      reservation.personnes = personnes;
      reservation.dateDebut = new Date(date);
      reservation.cout = this.transport.prixUnitaire * personnes;

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
        this.router.navigate(['panier']);
      }).catch((e) => {
        metro().activity.close(activity);
      });

    } else {
      const notify = metro().notify;
      notify.create('Veuillez renseigner la date', null, {
        cls: 'alert',
        keepOpen: true
      });
    }

  }

  getTransport(id: string) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('transports-trap').doc(id).get().then((resultat) => {
        const transport = resultat.data() as Transport;
        this.transport = transport;
        console.log('TERMINEEE !!!');
        console.log(this.transport);
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

}
