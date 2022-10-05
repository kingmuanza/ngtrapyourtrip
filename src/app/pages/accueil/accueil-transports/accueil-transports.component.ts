import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Transport } from 'src/app/models/transport.model';
import { Voiture } from 'src/app/models/voiture.model';
import { VoitureService } from 'src/app/services/voiture.service';
declare const metro: any;

@Component({
  selector: 'app-accueil-transports',
  templateUrl: './accueil-transports.component.html',
  styleUrls: ['./accueil-transports.component.scss']
})
export class AccueilTransportsComponent implements OnInit {

  transports = new Array<Transport>();
  voitures = new Array<Voiture>();
  constructor(
    private router: Router,
    private voitureService: VoitureService,
  ) { }

  ngOnInit(): void {
    this.voitureService.getVoitures().then((voitures) => {
      this.voitures = voitures;
    });
  }

}
