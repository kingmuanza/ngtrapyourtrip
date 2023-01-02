import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voiture } from 'src/app/models/voiture.model';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-display-voiture',
  templateUrl: './display-voiture.component.html',
  styleUrls: ['./display-voiture.component.scss']
})
export class DisplayVoitureComponent implements OnInit {

  @Input() voiture: Voiture;

  devise = PanierService.getDevise();
  langue = 'FR';
  fuseau = 'en';


  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
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

  voir(voiture: Voiture) {
    this.router.navigate(['offres', 'transport', 'location', voiture.id]);
  }

}
