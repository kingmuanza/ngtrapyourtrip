import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-divertissement-choix',
  templateUrl: './divertissement-choix.component.html',
  styleUrls: ['./divertissement-choix.component.scss']
})
export class DivertissementChoixComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  evenements() {
    this.router.navigate(['offres', 'divertissement', 'evenements']);
  }

  loisirs() {
    this.router.navigate(['offres', 'divertissement', 'loisirs']);
  }

  restaurants() {
    this.router.navigate(['offres', 'divertissement', 'restaurants']);
  }

  nouveau() {
    this.router.navigate(['offres', 'divertissement', 'edit']);
  }

}
