import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Administrateur } from 'src/app/models/administrateur.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-connexion',
  templateUrl: './admin-connexion.component.html',
  styleUrls: ['./admin-connexion.component.scss']
})
export class AdminConnexionComponent implements OnInit {

  form: FormGroup;
  admin: Administrateur;
  error = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      login: ['muanza', [Validators.required]],
      passe: ['123456', [Validators.required]],
    });
  }

  onSubmitForm() {
    const value = this.form.value;
    const login = value.login;
    const passe = value.passe;
    this.error = false;

    this.adminService.connexion(login, passe).then((admin) => {
      this.admin = admin;
    }).catch((e) => {
      this.error = true;
    });
  }

  accueil() {
    this.router.navigate(['accueil']);
  }

}
