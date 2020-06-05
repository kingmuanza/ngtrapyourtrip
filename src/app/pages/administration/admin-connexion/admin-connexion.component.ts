import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-connexion',
  templateUrl: './admin-connexion.component.html',
  styleUrls: ['./admin-connexion.component.scss']
})
export class AdminConnexionComponent implements OnInit {

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      login: ['trap', [Validators.required]],
      passe: ['trip', [Validators.required]],
    });
  }

  onSubmitForm() {
    const value = this.form.value;
    const login = value.login;
    const passe = value.passe;

    if (login === 'trap' && passe === 'trip') {
      this.router.navigate(['admin', 'console']);
    }

  }

}
