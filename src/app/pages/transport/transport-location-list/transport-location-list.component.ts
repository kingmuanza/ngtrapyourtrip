import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { DATATABLES_OPTIONS_LANGUAGE } from 'src/app/data/datatable.options';
import { Voiture } from 'src/app/models/voiture.model';
import { Transport } from 'src/app/models/transport.model';
import { VoitureService } from 'src/app/services/voiture.service';
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

  constructor(
    private router: Router,
    private voitureService: VoitureService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.voitureService.getVoitures().then((voitures) => {
      this.voitures = voitures;
    });
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
