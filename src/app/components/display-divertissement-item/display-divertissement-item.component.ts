import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DivertissementItem } from 'src/app/models/divertissement.item.model';
import { PanierService } from 'src/app/services/panier.service';

@Component({
  selector: 'app-display-divertissement-item',
  templateUrl: './display-divertissement-item.component.html',
  styleUrls: ['./display-divertissement-item.component.scss']
})
export class DisplayDivertissementItemComponent implements OnInit, OnChanges {

  @Input() divertissementItem: DivertissementItem;
  devise = PanierService.getDevise();

  langue = 'FR';
  fuseau = 'en';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const langue = localStorage.getItem('TYTLangue');
    if (langue) {
      this.langue = langue;
      if (langue === 'FR') {
        this.fuseau = 'fr';
      } else {
        this.fuseau = 'en';
      }
    }
  }

  voir() {
    this.router.navigate(['offres/divertissement/loisirs/item/view/', this.divertissementItem.id]);
  }

}
