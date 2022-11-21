import { Component, Input, OnInit } from '@angular/core';
import { Agence } from 'src/app/models/agence.model';

@Component({
  selector: 'app-display-agence',
  templateUrl: './display-agence.component.html',
  styleUrls: ['./display-agence.component.scss']
})
export class DisplayAgenceComponent implements OnInit {

  @Input() agence: Agence;

  constructor() { }

  ngOnInit(): void {
  }

}
