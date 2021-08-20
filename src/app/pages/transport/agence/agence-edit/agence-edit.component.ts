import { Component, OnInit } from '@angular/core';
import { Agence } from 'src/app/models/agence.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const db = firebase.firestore();
      db.collection('agences-trap').doc(id).get().then((resultat) => {
        const agence = resultat.data() as Agence;
        this.agence = agence;
        this.initForm();
      }).catch((e) => {
      });
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      nom: [this.agence ? this.agence.nom : '', Validators.required],
      bus: [this.agence ? Boolean(this.agence.bus) : false]
    });

  }

  onSubmitForm() {
    const value = this.form.value;
    let agence = new Agence();

    if (this.agence) {
      agence = this.agence;
    }

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
      this.router.navigate(['offres', 'transport', 'agence']);
    }).catch((e) => {
      metro().activity.close(activity);
    });

  }

}
