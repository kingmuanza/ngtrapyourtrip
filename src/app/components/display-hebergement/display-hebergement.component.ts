import { Component, OnInit, Input } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-hebergement',
  templateUrl: './display-hebergement.component.html',
  styleUrls: ['./display-hebergement.component.scss']
})
export class DisplayHebergementComponent implements OnInit {

  @Input() hebergement?: Hebergement;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['hebergement', 'view', id]);
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(255, 115, 0);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(255, 115, 0);"></span>';
    }
    return stars;
  }

}
