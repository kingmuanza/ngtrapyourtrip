import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { Sejour } from 'src/app/models/sejour.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/reservation.model';
import { Hebergement } from 'src/app/models/hebergement.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { PanierService } from 'src/app/services/panier.service';
declare const metro: any;

@Component({
  selector: 'app-hebergement-view',
  templateUrl: './hebergement-view.component.html',
  styleUrls: ['./hebergement-view.component.scss']
})
export class HebergementViewComponent implements OnInit, OnDestroy {

  @ViewChild('calendarpickerlocale', { static: false }) calendarpickerlocale;
  @ViewChild('calendarpickerlocale2', { static: false }) calendarpickerlocale2;

  hebergement: Hebergement;
  form: FormGroup;
  hebergements = new Array<Hebergement>();
  HEBERGEMENTS = new Array<Hebergement>();
  resultats = new Array<Hebergement>();
  others = new Array<Hebergement>();

  prestataires = new Array<Utilisateur>();

  indexImages = 0;
  changeImage;

  filtersShowed = false;
  recherchesShowed = false;
  screenHeight: number;
  screenWidth: number;
  mobile = true;
  formReservationShowed: boolean;
  fini = false;

  prestataire: Utilisateur;

  devise = PanierService.getDevise();
  fuseau = 'en';
  langue = 'FR';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const langue = localStorage.getItem('TYTLangue');
    if (langue) {
      this.langue = langue;
      if (langue === 'FR') {
        this.fuseau = 'fr';
      } else {
        this.fuseau = 'en';
      }
    }
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getSejour(id).then((hebergement) => {
          this.hebergement = hebergement;
          this.getPrestataire(this.hebergement.prestataire.id).then(() => {
            this.getPrestatairesMemeVille().then(() => {
              if (this.prestataires.length > 0) {
                const p = this.prestataires[0];
                this.getHebergementsByPrestataire(p).then((hebergements) => {
                  this.fini = true;
                  console.log('hebergements 155655');
                  console.log(hebergements);
                  this.hebergements = this.hebergements.concat(hebergements);
                });
              }
            });
            this.getOthers().then((resultats) => {
              this.others = resultats;
            });
            this.changementDimages();
            this.getSejours();
          });
        });
      }
    });
    this.initForm();
    this.getScreenSize();
  }

  showFormReservation() {
    this.formReservationShowed = !this.formReservationShowed;
  }

  toggleFilter() {
    this.filtersShowed = !this.filtersShowed;
  }

  rechercheFilter() {
    this.recherchesShowed = !this.recherchesShowed;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log('this.screenHeight, this.screenWidth');
    console.log(this.screenHeight, this.screenWidth);
    if (this.screenWidth > 599) {
      this.mobile = false;
      this.filtersShowed = true;
      this.formReservationShowed = true;
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      dateFin: ['', Validators.required],
      adultes: [1, Validators.required],
      enfants: [0, Validators.required],
    });
  }

  changementDimages() {
    if (this.hebergement) {
      if (this.hebergement.images) {
        if (this.hebergement.images.length > 0) {
          this.indexImages = 0;
          this.changeImage = setInterval(() => {
            const i = this.indexImages + 1;
            if (i < this.hebergement.images.length) {
              this.indexImages++;
            } else {
              this.indexImages = 0;
            }
            console.log('changement dimage');
            console.log(this.indexImages + ' sur ' + this.hebergement.images.length);
          }, 10000);
        }
      }
    }
  }

  choisir(i) {
    this.indexImages = i;
  }

  goToAll() {
    this.router.navigate(['offres', 'hebergement']);
  }

  goToPrestataire() {
    if (this.hebergement.prestataire) {
      this.router.navigate(['offres', 'hebergement', 'prestataire', this.hebergement.prestataire.id]);
    }
  }

  submit() {
    const value = this.form.value;
    console.log('value');
    console.log(value);
    console.log('this.calendarpickerlocale.nativeElement.value');
    console.log(this.calendarpickerlocale.nativeElement.value);

    const adultes = value.adultes;
    const enfants = value.enfants;
    const date = this.calendarpickerlocale.nativeElement.value;
    const dateFin = this.calendarpickerlocale2.nativeElement.value;

    if (date && dateFin) {
      const diff = new Date(dateFin).getTime() - new Date(date).getTime();
      console.log('difefrence');
      console.log(diff);

      if (new Date().getTime() < new Date(date).getTime() || new Date().toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]) {
        if (new Date(date).getTime() < new Date(dateFin).getTime()) {

          if (Number(enfants) > 5 || 0 > Number(enfants)) {
            alert('le nombre d\'enfants doit être inférieur à 5');
            return;
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          console.log('Nombre de jours');
          console.log(days);
          const reservation = new Reservation();
          reservation.hebergement = this.hebergement;
          reservation.personnes = adultes;
          reservation.enfants = enfants;
          reservation.dateDebut = new Date(date);
          reservation.dateFin = new Date(dateFin);
          reservation.cout = this.hebergement.nuitee * days;

          console.log('reservation');
          console.log(reservation);

          const activity = metro().activity.open({
            type: 'square',
            overlayColor: '#fff',
            overlayAlpha: 0.8
          });

          const panierString = localStorage.getItem('panier-trap');
          let panier = [];
          if (panierString) {
            panier = JSON.parse(panierString);
          }
          panier.push(reservation);
          localStorage.setItem('panier-trap', JSON.stringify(panier));

          const db = firebase.firestore();
          db.collection('reservation-trap').doc(reservation.id).set(JSON.parse(JSON.stringify(reservation))).then((resultats) => {
            console.log('TERMINEEE !!!');
            metro().activity.close(activity);
            this.router.navigate(['offres', 'reservation', 'view', reservation.id]);
          }).catch((e) => {
            metro().activity.close(activity);
          });

        } else {
          alert('La date d\'arrivée est supérieure à la date de départ');
        }
      } else {
        alert('La date d\'arrivée doit être supérieure ou être celle d\'aujourd\'hui');
      }

    } else {
      alert('Veuillez renseigner la date');
    }
  }
  onFormSubmit() {
    if (this.hebergement.prestataire.hotel) {
      this.submit();
    } else {
      this.check().then(() => {
        this.submit();
      }).catch(() => {
        alert('Ce bien est indisponible sur la période souhaitée. Veuillez changer de dates ou de biens svp');
      });
    }
  }

  check() {
    const dateDebut = this.calendarpickerlocale.nativeElement.value;
    const dateFin = this.calendarpickerlocale2.nativeElement.value;
    return this.checkDisponibilite(dateDebut, dateFin);
  }

  checkDisponibilite(dateDebut: Date, dateFin: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let reservations = new Array<Reservation>();
      const db = firebase.firestore();
      db.collection('reservation-trap')
        .where('hebergement.id', '==', this.hebergement.id)
        .get().then((resultats) => {
          console.log(resultats.size);
          resultats.forEach((resultat) => {
            console.log(resultat.data().dateDebut + ' ' + resultat.data().dateFin);
            const reservation = resultat.data() as Reservation;
            reservations.push(reservation);
          });
          console.log('reservations.length avant');
          console.log(reservations.length);
          reservations = reservations.filter((r) => {
            // tslint:disable-next-line:max-line-length
            const cas1 = new Date(r.dateDebut).getTime() <= new Date(dateDebut).getTime() && new Date(dateDebut).getTime() <= new Date(r.dateFin).getTime();
            // tslint:disable-next-line:max-line-length
            const cas2 = new Date(dateDebut).getTime() <= new Date(r.dateDebut).getTime() && new Date(r.dateDebut).getTime() <= new Date(dateFin).getTime();
            // tslint:disable-next-line:max-line-length
            const cas3 = new Date(dateDebut).getTime() <= new Date(r.dateFin).getTime() && new Date(r.dateFin).getTime() <= new Date(dateFin).getTime();
            // tslint:disable-next-line:max-line-length
            return cas1 || cas2 || cas3;
          });
          console.log('reservations.length');
          console.log(reservations.length);
          if (reservations.length === 0) {
            resolve(true);
          } else {
            reject(reservations);
          }
        });
    });
  }

  getSejour(id: string): Promise<Hebergement> {
    const activity = metro().activity.open({
      type: 'square',
      overlayColor: '#fff',
      overlayAlpha: 0.8
    });
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').doc(id).get().then((resultat) => {
        const hebergement = resultat.data() as Hebergement;
        resolve(new Hebergement(hebergement));
        metro().activity.close(activity);
      }).catch((e) => {
        metro().activity.close(activity);
        reject(e);
      });
    });
  }

  notationToStars(notation: number) {
    notation = Math.floor(notation);
    let stars = '';
    for (let i = 0; i < notation; i++) {
      stars = stars + '<span class="mif-star-full" style="color: rgb(48, 164, 221);"></span>';
    }
    for (let j = 0; j < 5 - notation; j++) {
      stars = stars + '<span class="mif-star-empty" style="color: rgb(48, 164, 221);"></span>';
    }
    return stars;
  }

  getSejours() {
    this.hebergements = new Array<Hebergement>();
    this.resultats = new Array<Hebergement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').get().then((resultats) => {
        resultats.forEach((resultat) => {

        });
        console.log('TERMINEEE !!!');
        console.log(this.hebergements);
        resolve(this.hebergements);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  modifier(prestataire) {
    this.router.navigate(['offres', 'hebergement', 'edit', prestataire.id]);
  }

  supprimer(element) {
    const oui = confirm('Etes vous sûr de vouloir supprimer cet élément ?');
    const db = firebase.firestore();
    if (oui) {
      db.collection('hebergements-trap').doc(element.id).delete().then(() => {
        this.router.navigate(['offres', 'hebergement']);
      });
    }
  }

  getOthers(): Promise<Array<Hebergement>> {
    const id = this.prestataire.id;
    const hebergements = new Array<Hebergement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').where('prestataire.id', '==', id)
        .get().then((resultats) => {
          resultats.forEach((resultat) => {
            let hebergement = resultat.data() as Hebergement;
            hebergement = new Hebergement(hebergement);
            if (hebergement.id !== this.hebergement.id) {
              hebergements.push(hebergement);
            }
          });
          resolve(hebergements);
        }).catch((e) => {
          reject(e);
        });
    });
  }

  getPrestatairesMemeVille() {
    this.prestataires = [];
    return new Promise((resolve, reject) => {
      if (this.prestataire.ville) {
        const db = firebase.firestore();
        db.collection('utilisateurs-trap').where('ville', '==', this.prestataire.ville).get().then((resultats) => {
          resultats.forEach((resultat) => {
            const prestataire = resultat.data() as Utilisateur;
            if (prestataire.id !== this.prestataire.id) {
              this.prestataires.push(prestataire);
            }
          });
          resolve(this.prestataires);
        });
      }
    });
  }

  getHebergementsByPrestataire(prestataire: Utilisateur): Promise<Array<Hebergement>> {
    const hebergements = new Array<Hebergement>();
    const db = firebase.firestore();
    return new Promise((resolve, reject) => {
      db.collection('hebergements-trap').where('prestataire.id', '==', prestataire.id)
        .get().then((resultats) => {
          resultats.forEach((resultat) => {
            let hebergement = resultat.data() as Hebergement;
            hebergement = new Hebergement(hebergement);
            if (hebergement.id !== this.hebergement.id) {
              hebergements.push(hebergement);
            }
          });
          resolve(hebergements);
        }).catch((e) => {
          reject(e);
        });
    });
  }

  getPrestataire(id: string) {
    return new Promise((resolve, reject) => {
      const db = firebase.firestore();
      db.collection('utilisateurs-trap').doc(id).get().then((resultat) => {
        const prestataire = resultat.data() as Utilisateur;
        this.prestataire = prestataire;
        resolve(prestataire);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.changeImage) {
      clearInterval(this.changeImage);
    }
  }

}
