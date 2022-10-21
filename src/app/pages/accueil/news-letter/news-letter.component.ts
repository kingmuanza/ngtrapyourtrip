import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-news-letter',
  templateUrl: './news-letter.component.html',
  styleUrls: ['./news-letter.component.scss']
})
export class NewsLetterComponent implements OnInit {

  email = '';
  form: FormGroup;

  inscrit = false;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }

  enregisterMail() {
    const e = this.form.value.email;
    const db = firebase.firestore();
    db.collection('emails-trap').doc(e).set({
      email: e,
      date: new Date()
    }).then((resultat) => {
      this.inscrit = true;
    });
  }

}
