import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { Voiture } from 'src/app/models/voiture.model';
import { Transport } from 'src/app/models/transport.model';
import { VoitureService } from 'src/app/services/voiture.service';
import { Ville } from 'src/app/models/ville.model';
declare const metro: any;

@Component({
  selector: 'app-transport-location-list',
  templateUrl: './transport-location-list.component.html',
  styleUrls: ['./transport-location-list.component.scss']
})
export class TransportLocationListComponent implements OnInit {

  @ViewChild('ville', { static: false }) departInput: ElementRef;

  form: FormGroup;
  voitures = new Array<Voiture>();
  resultats = new Array<Voiture>();
  villes = new Array<Ville>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private voitureService: VoitureService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getVilles();
    this.initForm();
    this.voitureService.getVoitures().then((voitures) => {
      this.voitures = voitures.filter((voiture) => {
        return voiture.categorie === this.route.snapshot.params.id;
      });

      this.voitures = this.voitures.sort((a, b) => {
        let ac = a.coutInterurbain ? a.coutInterurbain : 0;
        let bc = b.coutInterurbain ? b.coutInterurbain : 0;
        return ac > bc ? 1 : -1;
      });
      this.resultats = this.voitures;
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      ville: ['0', []],
      rechercher: ['', []],
      transmission: ['0', []],
      categorie: ['', []],
    });
  }

  onFormSubmit() {
    const value = this.form.value;
    console.log('value');
    console.log(value.transmission);
    console.log(value.ville);
    if (value.transmission != "0") {
      this.resultats = this.voitures.filter((v) => {
        return v.transmission === value.transmission;
      });
    } else {
      this.resultats = this.voitures;
    }
    if (value.ville != "0") {
      this.resultats = this.resultats.filter((v) => {
        return v.ville === value.ville;
      });
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
    this.router.navigate(['offres', 'transport', 'location', 'voiture', voiture.id]);
  }

  getVilles() {
    this.villes = new Array<Ville>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    db.collection('ville-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      metro().activity.close(activity);
      resultats.forEach((resultat) => {
        const ville = resultat.data() as Ville;
        this.villes.push(ville);
      });
    }).catch((e) => {
      metro().activity.close(activity);
    });
  }

}
