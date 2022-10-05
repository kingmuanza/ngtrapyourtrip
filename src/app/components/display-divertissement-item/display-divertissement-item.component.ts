import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DivertissementItem } from 'src/app/models/divertissement.item.model';

@Component({
  selector: 'app-display-divertissement-item',
  templateUrl: './display-divertissement-item.component.html',
  styleUrls: ['./display-divertissement-item.component.scss']
})
export class DisplayDivertissementItemComponent implements OnInit {

  @Input() divertissementItem: DivertissementItem;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  voir() {
    this.router.navigate(['offres/divertissement/loisirs/item/view/', this.divertissementItem.id]);
  }

}
