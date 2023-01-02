import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  reservations = [];
  panierSubject = new Subject<Array<Reservation>>();

  constructor() {
    this.getPanier();
  }

  emit() {
    this.panierSubject.next(this.reservations);
  }

  getPanier() {
    const panierString = localStorage.getItem('panier-trap');
    if (panierString) {
      this.reservations = JSON.parse(panierString);
      this.emit();
    }
  }

  static getDevise() {
    const devise = localStorage.getItem('TYTDevise');
    if (devise) {
      return devise;
    } else {
      return 'XAF';
    }
  }

  static getLangue() {
    const langue = localStorage.getItem('TYTLangue');
    if (langue) {
      return langue;
    } else {
      return 'FR';
    }
  }
}
