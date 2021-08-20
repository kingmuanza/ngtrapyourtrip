import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Transport } from 'src/app/models/transport.model';

@Component({
  selector: 'app-display-transport',
  templateUrl: './display-transport.component.html',
  styleUrls: ['./display-transport.component.scss']
})
export class DisplayTransportComponent implements OnInit {

  @Input() transport?: Transport;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['transport', 'view', id]);
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
