import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { DivertissementItem } from 'src/app/models/divertissement.item.model';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Reservation } from 'src/app/models/reservation.model';
declare const metro: any;

@Component({
  selector: 'app-loisir-view',
  templateUrl: './loisir-view.component.html',
  styleUrls: ['./loisir-view.component.scss']
})
export class LoisirViewComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;

  heures = [];
  divertissement: Divertissement;
  divertissementItems = new Array<DivertissementItem>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    for (let i = 1; i < 10; i++) {
      this.heures.push('0' + i + ':00');
    }
    for (let i = 10; i < 24; i++) {
      this.heures.push(i + ':00');
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id).then(() => {
          this.getActivites();
        });
      }
    });
  }

  modifier(element) {
    this.router.navigate(['offres', 'divertissement', 'edit', element.id]);
  }

  supprimer(element) {
    const oui = confirm('Etes vous sûr de vouloir supprimer cet élément ?');
    const db = firebase.firestore();
    db.collection('divertissements').doc(element.id).delete().then(() => {
      this.router.navigate(['offres', 'divertissement']);
    });
  }

  getSejour(id: string) {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-trap').doc(id).get().then((resultat) => {
        const divertissement = resultat.data() as Divertissement;
        this.divertissement = divertissement;
        console.log('TERMINEEE !!!');
        console.log(this.divertissement);
        metro().activity.close(activity);
        resolve(divertissement);
      }).catch((e) => {
        metro().activity.close(activity);
      });
    });
  }

  getActivites() {
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('divertissements-item-trap').where('divertissement.id', '==', this.divertissement.id).get().then((resultats) => {
        resultats.forEach((resultat) => {
          const divertissementItem = resultat.data() as DivertissementItem;
          this.divertissementItems.push(divertissementItem);
          console.log('TERMINEEE !!!');
          console.log(this.divertissementItems);
        });
      }).catch((e) => {
      });
    });
  }

  ouvrirGoogleMap() {
    const lien = 'http://maps.google.com/maps?q=' + this.divertissement.latitude + ',' + this.divertissement.longitude;
    window.open(lien);
  }

}
