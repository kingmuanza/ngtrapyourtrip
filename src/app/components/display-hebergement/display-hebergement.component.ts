import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-hebergement',
  templateUrl: './display-hebergement.component.html',
  styleUrls: ['./display-hebergement.component.scss']
})
export class DisplayHebergementComponent implements OnInit, OnChanges {

  @Input() hebergement?: Hebergement;
  @Input() cliquable = true;

  langue = 'FR';
  fuseau = 'en';

  constructor(
    private router: Router,
  ) { }

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

  ngOnInit(): void {
  }

  ouvrir(id) {
    if (this.cliquable) {
      this.router.navigate(['offres', 'hebergement', 'view', id]);
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
