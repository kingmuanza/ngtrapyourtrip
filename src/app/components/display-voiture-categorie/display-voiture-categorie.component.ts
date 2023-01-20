import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voiture } from 'src/app/models/voiture.model';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-display-voiture-categorie',
  templateUrl: './display-voiture-categorie.component.html',
  styleUrls: ['./display-voiture-categorie.component.scss']
})
export class DisplayVoitureCategorieComponent implements OnInit {

  @Input() categorie: string;

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

  voir(categorie: string) {
    this.router.navigate(['offres', 'transport', 'location', 'categorie', categorie]);
  }

}
