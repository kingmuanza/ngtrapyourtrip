import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';
import { Sejour } from 'src/app/models/sejour.model';
import { Ville } from 'src/app/models/ville.model';
import { SejourService } from 'src/app/services/sejour.service';
declare const metro: any;

@Component({
  selector: 'app-sejour-list',
  templateUrl: './sejour-list.component.html',
  styleUrls: ['./sejour-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SejourListComponent implements OnInit {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('ville', { static: false }) departInput: ElementRef;

  sejours$!: Observable<Array<Sejour>>;
  recherche = '';
  ordre = 'croissant';
  form: FormGroup;
  nature = '';
  triEtoiles = 0;
  triEtoilesIntention = 0;

  filtersShowed = false;
  recherchesShowed = false;
  screenHeight: number;
  screenWidth: number;
  mobile = true;

  villes = new Array<Ville>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sejourService: SejourService,
  ) {
    this.getScreenSize();
    this.sejours$ = this.sejourService.sejours;
    this.sejourService.getAllFromFirebase();
  }

  ngOnInit(): void {
    this.initForm();
    this.getVilles();
  }

  initForm() {
    this.form = this.formBuilder.group({
      mot: ['', []],
      ville: ['', []],
      adultes: [1, []],
      enfants: [0, []],

      relaxation: [false],
      pieds: [false],
      phasenature: [false],
      sportif: [false],
      gastronomique: [false],
      insolite: [false],
      festive: [false],
      affaire: [false],
      culturel: [false],
      animaux: [false],

      spa: [false],
      soin: [false],
      massage: [false],

      pension: [false],
      diner: [false],
      degustation: [false],
      pensioncomplete: [false],

      visiteguidee: [false],
      autresvisites: [false],

      golf: [false],
      sallesport: [false],
      velo: [false],
      tennis: [false],
      basket: [false],

      ponctuel: [false],
      attraction: [false],
      spectacle: [false],
      zoo: [false],
      foire: [false],
      randonnee: [false],

      maisonvacances: [false],
      appartementvacances: [false],
      chambrehotel: [false],
      villagevacances: [false],

      hotel: [false],
      pointrencontre: [false],
      lieuactivite: [false],

      francais: [false],
      anglais: [false],
      arabe: [false],

    });
    let changementFormulaire$ = this.form.valueChanges.pipe(startWith({}));
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    this.sejours$ = combineLatest([changementFormulaire$, this.sejours$]).pipe(
      map(([formValue, s]) => {
        return this.onSubmitForm(s);
      }),
      tap(() => {
        metro().activity.close(activity);
      })
    );
  }

  onSubmitForm(sejours: Array<Sejour>) {
    console.log("onSubmitForm");
    const value = this.form.value;
    let resultats = new Array<Sejour>();
    resultats = sejours.filter((prestataire) => {
      const keys = Object.keys(value);
      let toutOK = true;
      keys.forEach((key) => {
        // console.log(key);
        if (value[key] === true) {
          // console.log(key);
          if (prestataire.options && !prestataire.options[key]) {
            toutOK = false;
          }

          if (!prestataire.options) {
            toutOK = false;
          }

        }
      });
      return toutOK;
    });
    return resultats;

  }

  nouveau() {
    this.router.navigate(['offres', 'sejour', 'edit']);
  }

  ouvrir(id) {
    this.router.navigate(['sejour', 'view', id]);
  }

  getVilles() {
    this.villes = new Array<Ville>();
    const db = firebase.firestore();
    db.collection('ville-trap').get().then((resultats) => {
      console.log('TERMINEEE !!!');
      resultats.forEach((resultat) => {
        const ville = resultat.data() as Ville;
        this.villes.push(ville);
      });
    }).catch((e) => {
    });
  }

  toggleFilter() {
    this.filtersShowed = !this.filtersShowed;
  }

  rechercheFilter() {
    if (this.departInput) {
      const texte = this.departInput.nativeElement.value;
      const date = this.calendarpickerlocale.nativeElement.value;
      console.log(texte);
      console.log(date);
      let ladate = new Date('2020-01-01');
      if (date) {
        ladate = new Date(date);
      }
      console.log(ladate);
      this.sejours$ = this.sejourService.sejours.pipe(map(sejours => sejours.filter(this.filterTexte(texte))));
      this.sejours$ = this.sejours$.pipe(map(sejours => sejours.filter(this.filterDate(ladate))));
    } else {
      this.recherchesShowed = !this.recherchesShowed;
    }
  }

  private filterDate(ladate: Date): any {
    let resultat = false;
    return (sejour: Sejour) => {
      if (ladate) {
        if (sejour.dateDebut) {
          resultat = new Date(sejour.dateDebut).getTime() - ladate.getTime() > 0;
        }
        if (sejour.dateFin) {
          resultat = new Date(sejour.dateFin).getTime() - ladate.getTime() > 0;
        }
      } else {
        return true;
      }
      return resultat;
    };
  }

  private filterTexte(texte: any): any {
    return (sejour) => {
      if (texte) {
        if (sejour.ville) {
          return sejour.ville.indexOf(texte) !== -1;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    /* console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth); */
    if (this.screenWidth > 599) {
      this.mobile = false;
      this.filtersShowed = true;
      this.recherchesShowed = true;
    }
  }

  changerEtoiles(nombre: number) {
    console.log('changerEtoiles : ' + nombre);
    this.triEtoiles = nombre;
    this.triEtoilesIntention = nombre;
  }

  changerEtoilesIntention(nombre: number) {
    console.log('changerEtoilesIntention : ' + nombre);
    this.triEtoilesIntention = nombre;
  }

  reinitEtoiles() {
    console.log('reinitEtoiles');
    this.triEtoilesIntention = 0;
  }

}
