import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Sejour } from 'src/app/models/sejour.model';

@Component({
  selector: 'app-display-sejour',
  templateUrl: './display-sejour.component.html',
  styleUrls: ['./display-sejour.component.scss']
})
export class DisplaySejourComponent implements OnInit {

  @Input() sejour?: Sejour;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['offres', 'sejour', 'view', id]);
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
