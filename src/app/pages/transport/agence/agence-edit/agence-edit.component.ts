import { Component, OnInit } from '@angular/core';
import { Agence } from 'src/app/models/agence.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-agence-edit',
  templateUrl: './agence-edit.component.html',
  styleUrls: ['./agence-edit.component.scss']
})
export class AgenceEditComponent implements OnInit {

  agence: Agence;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      bus: [false]
    });

  }

  onSubmitForm() {
    const value = this.form.value;
    const agence = new Agence();

    agence.nom = value.nom;
    if (value.bus) {
      agence.bus = true;
    } else {
      agence.bus = false;
    }

    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });

    const db = firebase.firestore();
    db.collection('agences-trap').doc(agence.id).set(JSON.parse(JSON.stringify(agence))).then(() => {
      metro().activity.close(activity);
      this.router.navigate(['offres', 'transport']);
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

}
