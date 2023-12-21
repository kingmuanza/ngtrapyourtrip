import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Agence } from 'src/app/models/agence.model';
import { Trajet } from 'src/app/models/trajet.model';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-display-agence',
  templateUrl: './display-agence.component.html',
  styleUrls: ['./display-agence.component.scss']
})
export class DisplayAgenceComponent implements OnInit, OnChanges {

  @Input() agence: Agence;
  @Input() prix = 0;
  @Input() prixAR = 0;
  langue = 'FR';
  fuseau = 'en';
  devise = PanierService.getDevise();
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const langue = localStorage.getItem('TYTLangue');
    if (langue) {
      this.langue = langue;
      if (langue === 'FR') {
        this.fuseau = 'fr';
      } else {
        this.fuseau = 'en';
      }
    }
  }

}
