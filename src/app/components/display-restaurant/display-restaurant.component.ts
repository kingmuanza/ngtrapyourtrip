import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Divertissement } from 'src/app/models/divertissement.model';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-display-restaurant',
  templateUrl: './display-restaurant.component.html',
  styleUrls: ['./display-restaurant.component.scss']
})
export class DisplayRestaurantComponent implements OnInit {

  @Input() divertissement?: Divertissement;
  @Input() cliquable = true;

  date = new Date();

  langue = 'FR';
  fuseau = 'en';
  devise = PanierService.getDevise();

  constructor(
    private router: Router,
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

  ouvrir(id) {
    if (this.cliquable) {
      this.router.navigate(['offres', 'divertissement', 'restaurants', 'view', id]);
    }
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

}
