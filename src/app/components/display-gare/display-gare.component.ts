import { Component, Input, OnInit } from '@angular/core';
import { Gare } from 'src/app/models/gare.model';

@Component({
  selector: 'app-display-gare',
  templateUrl: './display-gare.component.html',
  styleUrls: ['./display-gare.component.scss']
})
export class DisplayGareComponent implements OnInit {

  @Input() gare: Gare;
  constructor() { }

  ngOnInit(): void {
  }

}
