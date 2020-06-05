import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  menu = 'nouveau-sejour';
  constructor() { }

  ngOnInit(): void {
  }

  nouveauSejour() {

  }

  setMenu(menu: string) {
    this.menu = menu;
  }

}
