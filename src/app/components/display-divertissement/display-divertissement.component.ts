import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Divertissement } from 'src/app/models/divertissement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-divertissement',
  templateUrl: './display-divertissement.component.html',
  styleUrls: ['./display-divertissement.component.scss']
})
export class DisplayDivertissementComponent implements OnInit, OnChanges {

  @Input() divertissement?: Divertissement;
  @Input() cliquable = true;

  date = new Date();
  passee = false;

  constructor(
    private router: Router,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const date = new Date(this.divertissement?.date);
    if (date.getTime() < new Date().getTime()) {
      this.passee = true;
    }
  }

  ngOnInit(): void {
  }

  ouvrir(id) {
    if (this.cliquable) {
      this.router.navigate(['offres', 'divertissement', 'evenements', 'view', id]);
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
