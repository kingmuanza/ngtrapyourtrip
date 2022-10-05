import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Voiture } from 'src/app/models/voiture.model';

@Component({
  selector: 'app-display-voiture',
  templateUrl: './display-voiture.component.html',
  styleUrls: ['./display-voiture.component.scss']
})
export class DisplayVoitureComponent implements OnInit {

  @Input() voiture: Voiture;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  voir(voiture: Voiture) {
    this.router.navigate(['offres', 'transport', 'location', voiture.id]);
  }

}
