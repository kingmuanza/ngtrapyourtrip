import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  screenHeight: number;
  screenWidth: number;
  mobile = true;
  constructor(
    private router: Router,
  ) {
    this.getScreenSize();
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
    }
  }

  goTo(lien: string) {
    this.router.navigate([lien]);
  }

}
