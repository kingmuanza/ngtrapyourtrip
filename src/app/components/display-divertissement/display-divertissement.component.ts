import { Component, OnInit, Input } from '@angular/core';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-divertissement',
  templateUrl: './display-divertissement.component.html',
  styleUrls: ['./display-divertissement.component.scss']
})
export class DisplayDivertissementComponent implements OnInit {

  @Input() divertissement?: Divertissement;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['divertissement', 'view', id]);
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
