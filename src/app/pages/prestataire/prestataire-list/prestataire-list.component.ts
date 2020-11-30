import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare const metro: any;

@Component({
  selector: 'app-prestataire-list',
  templateUrl: './prestataire-list.component.html',
  styleUrls: ['./prestataire-list.component.scss']
})
export class PrestataireListComponent implements OnInit {

  utilisateurs = new Array<Utilisateur>();
  HEBERGEMENTS = new Array<Utilisateur>();
  resultats = new Array<Utilisateur>();
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  triEtoiles = 0;
  triEtoilesIntention = 0;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getPrestataires();
    this.initForm();
  }

  changerEtoiles(nombre: number) {
    console.log('changerEtoiles : ' + nombre);
    this.triEtoiles = nombre;
    this.triEtoilesIntention = nombre;
    this.resultats = this.utilisateurs;
    this.resultats = this.resultats.filter((prestataire) => {
      return prestataire.notation && prestataire.notation >= nombre;
    });
  }

  changerEtoilesIntention(nombre: number) {
    console.log('changerEtoilesIntention : ' + nombre);
    this.triEtoilesIntention = nombre;
  }

  reinitEtoiles() {
    console.log('reinitEtoiles');
    this.triEtoilesIntention = 0;
  }

  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      ville: ['', []],
      nature: ['tous', []],
      adultes: [1, []],
      enfants: [0, []],
      wifi: [false],
      plage: [false],
      piscine: [false],
      climatiseur: [false],
      parking: [false],
      petitdej: [false],
      gardien: [false],
    });
    this.form.valueChanges.subscribe(() => {
      this.onSubmitForm();
    });
  }

  onSubmitForm() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    const nature = value.nature;
    this.resultats = this.utilisateurs;
    if (value.mot) {
      this.resultats = this.rechercher(value.mot);
    }
    if (value.ville) {
      this.resultats = this.rechercher(value.ville);
    }

    let options = true;

    this.resultats = this.resultats.filter((prestataire) => {
      if (prestataire.options) {
        const wifi = value.wifi ? prestataire.options.wifi : true;
        const parking = value.parking ? prestataire.options.parking : true;
        const plage = value.plage ? prestataire.options.plage : true;
        const piscine = value.piscine ? prestataire.options.piscine : true;
        const climatiseur = value.climatiseur ? prestataire.options.climatiseur : true;
        const petitdej = value.petitdej ? prestataire.options.petitdej : true;
        const gardien = value.gardien ? prestataire.options.gardien : true;
        options = wifi && parking && plage && piscine && climatiseur && petitdej && gardien;

      } else {
        options = true;
      }
      if (nature === 'villa') {
        return options && prestataire && prestataire.prestataire && (prestataire.villa || !prestataire.hotel);
      }
      if (nature === 'hotel') {
        return options && prestataire && prestataire.prestataire && prestataire.hotel;
      }
      return options && prestataire && prestataire.prestataire;
    });

    this.ordonner(this.ordre);

  }

  changerOrdre(ordre) {
    this.ordre = ordre;
    this.ordonner(ordre);
  }

  ouvrir(id) {
    this.router.navigate(['utilisateur', 'view', id]);
  }

  getPrestataires() {
    this.utilisateurs = new Array<Utilisateur>();
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('utilisateurs-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {
          const utilisateur = resultat.data() as Utilisateur;
          /*if (!utilisateur.options) {
            utilisateur.options = {
              wifi: false,
              plage: false,
              piscine: false,
              climatiseur: false,
              parking: false,
              petitdej: false,
              gardien: false,
            };
            utilisateur.options.parking = utilisateur.parking;
            utilisateur.options.wifi = utilisateur.wifi;
          }*/
          if (utilisateur.prestataire) {
            this.utilisateurs.push(utilisateur);
            this.resultats.push(utilisateur);
          }
        });
        console.log('TERMINEEE !!!');
        console.log(this.utilisateurs);
        metro().activity.close(activity);
        this.ordonner(this.ordre);
        resolve(this.utilisateurs);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  rechercher(mot: string) {
    return this.resultats.filter((utilisateur) => {
      const description = utilisateur.description ? utilisateur.description.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const titre = utilisateur.nom ? utilisateur.nom.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const pays = utilisateur.pays ? utilisateur.pays.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const ville = utilisateur.ville ? utilisateur.ville.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      const lieu = utilisateur.localisation ? utilisateur.localisation.toLowerCase().indexOf(mot.toLowerCase()) !== -1 : false;
      return titre || description || pays || ville || lieu;

    });
  }

  ordonner(ev) {
    console.log(ev);
    if (ev === 'croissant') {
      this.resultats.sort((a, b) => {
        return a.notation - b.notation > 0 ? 1 : -1;
      });
    } else {
      this.resultats.sort((a, b) => {
        return a.notation - b.notation > 0 ? -1 : 1;
      });
    }
  }
}
