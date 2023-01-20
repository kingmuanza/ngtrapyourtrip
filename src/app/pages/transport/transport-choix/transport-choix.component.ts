import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transport-choix',
  templateUrl: './transport-choix.component.html',
  styleUrls: ['./transport-choix.component.scss']
})
export class TransportChoixComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  interurbain() {
    this.router.navigate(['offres', 'transport', 'recherche']);
  }

  location() {
    this.router.navigate(['offres', 'transport', 'location', 'categorie']);
  }

}
