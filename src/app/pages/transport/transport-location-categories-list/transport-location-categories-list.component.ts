import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Voiture } from 'src/app/models/voiture.model';
import { VoitureService } from 'src/app/services/voiture.service';
declare const metro: any;

@Component({
  selector: 'app-transport-location-categories-list',
  templateUrl: './transport-location-categories-list.component.html',
  styleUrls: ['./transport-location-categories-list.component.scss']
})
export class TransportLocationCategoriesListComponent implements OnInit {

  @ViewChild('ville', { static: false }) departInput: ElementRef;

  form: FormGroup;
  categories = new Array<string>();

  constructor(
    private router: Router,
    private voitureService: VoitureService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.categories = [];
    const db = firebase.firestore();
    db.collection('categories-trap').get().then((resultats) => {
      resultats.forEach((resultat) => {
        const cat = resultat.data() as any;
        this.categories.push(cat.nom);

      });
    }).catch((e) => {
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      ville: ['', []],
      rechercher: ['', []],
      transmission: ['', []],
      categorie: ['', []],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
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
  }

}
