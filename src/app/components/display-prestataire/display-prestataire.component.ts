import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-prestataire',
  templateUrl: './display-prestataire.component.html',
  styleUrls: ['./display-prestataire.component.scss']
})
export class DisplayPrestataireComponent implements OnInit, OnChanges {

  @Input() prestataire: Utilisateur;
  photoURL = '../../../assets/img/prestataire.png';

  constructor(
    private router: Router
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('this.prestataire');
    console.log(this.prestataire);
    if (this.prestataire && this.prestataire.photoURL) {
      this.photoURL = this.prestataire.photoURL;
    }
  }

  ngOnInit(): void {
  }

  ouvrir(id) {
    this.router.navigate(['offres', 'hebergement', 'prestataire', id]);
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
