import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Divertissement } from 'src/app/models/divertissement.model';

@Component({
  selector: 'app-display-loisir',
  templateUrl: './display-loisir.component.html',
  styleUrls: ['./display-loisir.component.scss']
})
export class DisplayLoisirComponent implements OnInit {

  @Input() divertissement?: Divertissement;

  date = new Date();

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['offres', 'divertissement', 'loisirs', 'view', id]);
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
