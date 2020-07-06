import { Component, OnInit } from '@angular/core';
import { Hebergement } from 'src/app/models/hebergement.model';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  menu = 'nouveau-hebergement';
  hebergement: Hebergement;
  constructor() { }

  ngOnInit(): void {
  }

  nouveauSejour() {

  }

  setMenu(menu: string) {
    this.menu = menu;
  }

  editHebergement(hebergement) {
    this.menu = 'edit-hebergement';
  }

}
