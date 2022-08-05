import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { SejourViewComponent } from './pages/sejour/sejour-view/sejour-view.component';

// tslint:disable-next-line:ordered-imports
import { SejourListComponent } from './pages/sejour/sejour-list/sejour-list.component';
import { SejourEditComponent } from './pages/sejour/sejour-edit/sejour-edit.component';
import { RechercherComponent } from './pages/rechercher/rechercher.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminConnexionComponent } from './pages/administration/admin-connexion/admin-connexion.component';
import { ConsoleComponent } from './pages/administration/console/console.component';
import { PanierComponent } from './pages/panier/panier.component';
import { PaiementListComponent } from './pages/paiement/paiement-list/paiement-list.component';
import { PaiementEditComponent } from './pages/paiement/paiement-edit/paiement-edit.component';
import { PaiementViewComponent } from './pages/paiement/paiement-view/paiement-view.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { HebergementListComponent } from './pages/hebergement/hebergement-list/hebergement-list.component';
import { HebergementViewComponent } from './pages/hebergement/hebergement-view/hebergement-view.component';
import { HebergementEditComponent } from './pages/hebergement/hebergement-edit/hebergement-edit.component';
import { DivertissementEditComponent } from './pages/divertissement/divertissement-edit/divertissement-edit.component';
import { DivertissementViewComponent } from './pages/divertissement/divertissement-view/divertissement-view.component';
import { DivertissementListComponent } from './pages/divertissement/divertissement-list/divertissement-list.component';
import { TransportListComponent } from './pages/transport/transport-list/transport-list.component';
import { TransportEditComponent } from './pages/transport/transport-edit/transport-edit.component';
import { TransportViewComponent } from './pages/transport/transport-view/transport-view.component';
import { ReservationListComponent } from './pages/reservation/reservation-list/reservation-list.component';
import { ReservationViewComponent } from './pages/reservation/reservation-view/reservation-view.component';
import { ReservationEditComponent } from './pages/reservation/reservation-edit/reservation-edit.component';
import { PrestataireListComponent } from './pages/prestataire/prestataire-list/prestataire-list.component';
import { PrestataireViewComponent } from './pages/prestataire/prestataire-view/prestataire-view.component';
import { PrestataireEditComponent } from './pages/prestataire/prestataire-edit/prestataire-edit.component';
import { ReservationInfosComponent } from './pages/reservation/reservation-infos/reservation-infos.component';
import { ReservationRecapComponent } from './pages/reservation/reservation-recap/reservation-recap.component';
import { PhotoComponent } from './pages/inscription/photo/photo.component';
import { MoncompteComponent } from './pages/moncompte/moncompte.component';
import { OubliComponent } from './pages/oubli/oubli.component';
import { TrajetEditComponent } from './pages/transport/trajet/trajet-edit/trajet-edit.component';
import { AgenceEditComponent } from './pages/transport/agence/agence-edit/agence-edit.component';
import { DepartEditComponent } from './pages/transport/depart/depart-edit/depart-edit.component';
import { DepartListComponent } from './pages/transport/depart/depart-list/depart-list.component';
import { DepartViewComponent } from './pages/transport/depart/depart-view/depart-view.component';
import { DivertissementChoixComponent } from './pages/divertissement/divertissement-choix/divertissement-choix.component';
import { LoisirListComponent } from './pages/divertissement/loisir-list/loisir-list.component';
import { LoisirViewComponent } from './pages/divertissement/loisir-view/loisir-view.component';
import { RestaurantListComponent } from './pages/divertissement/restaurant-list/restaurant-list.component';
import { RestaurantViewComponent } from './pages/divertissement/restaurant-view/restaurant-view.component';
import { VilleComponent } from './pages/accueil/ville/ville.component';
import { AgenceListComponent } from './pages/transport/agence/agence-list/agence-list.component';
import { AboutComponent } from './pages/about/about.component';
import { ConditionsComponent } from './pages/conditions/conditions.component';
import { CharteComponent } from './pages/charte/charte.component';
import { TransportChoixComponent } from './pages/transport/transport-choix/transport-choix.component';
import { TransportLocationListComponent } from './pages/transport/transport-location-list/transport-location-list.component';
import { TransportLocationViewComponent } from './pages/transport/transport-location-view/transport-location-view.component';
import { CancelComponent } from './pages/paiement/cancel/cancel.component';
import { ReturnComponent } from './pages/paiement/return/return.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'cancel/:id', component: CancelComponent },
  { path: 'return/:id', component: ReturnComponent },

  { path: 'rechercher', component: RechercherComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'inscription/photo', component: PhotoComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'oubli', component: OubliComponent },

  { path: 'dashboard/paiement', component: PaiementListComponent },
  { path: 'dashboard/paiement/edit', component: PaiementEditComponent },
  { path: 'dashboard/paiement/view/:id', component: PaiementViewComponent },
  { path: 'dashboard/profil', component: PhotoComponent },
  { path: 'dashboard/compte', component: MoncompteComponent },
  { path: 'dashboard/reservation', component: ReservationListComponent },
  { path: 'dashboard/paiement', component: PaiementListComponent },

  { path: 'admin/connexion', component: AdminConnexionComponent },
  { path: 'admin/console', component: ConsoleComponent },

  { path: 'offres/villes/view/:id', component: VilleComponent },

  { path: 'offres/sejour', component: SejourListComponent },
  { path: 'offres/sejour/view/:id', component: SejourViewComponent },
  { path: 'offres/sejour/edit', component: SejourEditComponent },
  { path: 'offres/sejour/edit/:id', component: SejourEditComponent },

  { path: 'offres/hebergement', component: PrestataireListComponent },
  { path: 'offres/hebergement/prestataire/:id', component: HebergementListComponent },
  { path: 'offres/hebergement/view/:id', component: HebergementViewComponent },
  { path: 'offres/hebergement/edit', component: HebergementEditComponent },
  { path: 'offres/hebergement/edit/:id', component: HebergementEditComponent },

  { path: 'offres/reservation', component: ReservationListComponent },
  { path: 'offres/reservation/view/:id', component: ReservationViewComponent },
  { path: 'offres/reservation/infos/:id', component: ReservationInfosComponent },
  { path: 'offres/reservation/recap/:id', component: ReservationRecapComponent },
  { path: 'offres/reservation/edit', component: ReservationEditComponent },
  { path: 'offres/reservation/edit/:id', component: ReservationEditComponent },

  { path: 'divertissement', component: DivertissementChoixComponent },
  { path: 'divertissement/view/:id', component: DivertissementViewComponent },
  { path: 'divertissement/edit', component: DivertissementEditComponent },
  { path: 'divertissement/edit/:id', component: DivertissementEditComponent },

  { path: 'offres/divertissement', component: DivertissementChoixComponent },
  { path: 'offres/divertissement/evenements', component: DivertissementListComponent },
  { path: 'offres/divertissement/loisirs', component: LoisirListComponent },
  { path: 'offres/divertissement/restaurants', component: RestaurantListComponent },
  { path: 'offres/divertissement/restaurants/view/:id', component: RestaurantViewComponent },
  { path: 'offres/divertissement/evenements/view/:id', component: DivertissementViewComponent },
  { path: 'offres/divertissement/loisirs/view/:id', component: LoisirViewComponent },
  { path: 'offres/divertissement/edit', component: DivertissementEditComponent },
  { path: 'offres/divertissement/edit/:id', component: DivertissementEditComponent },

  { path: 'offres/transport', component: TransportChoixComponent },
  { path: 'offres/transport/recherche', component: TransportListComponent },
  { path: 'offres/transport/location', component: TransportLocationListComponent },
  { path: 'offres/transport/location/:id', component: TransportLocationViewComponent },
  { path: 'offres/transport/view/:id', component: TransportViewComponent },
  { path: 'offres/transport/edit', component: TransportEditComponent },
  { path: 'offres/transport/edit/:id', component: TransportEditComponent },

  { path: 'offres/transport/trajet/edit', component: TrajetEditComponent },
  { path: 'offres/transport/trajet/edit/:id', component: TrajetEditComponent },
  { path: 'offres/transport/agence', component: AgenceListComponent },
  { path: 'offres/transport/agence/edit', component: AgenceEditComponent },
  { path: 'offres/transport/agence/edit/:id', component: AgenceEditComponent },

  { path: 'offres/transport/depart/edit', component: DepartEditComponent },
  { path: 'offres/transport/depart/edit/:id', component: DepartEditComponent },
  { path: 'offres/transport/depart/list/:id', component: DepartListComponent },
  { path: 'offres/transport/depart/view/:id/:heure', component: DepartViewComponent },

  { path: 'prestataire', component: PrestataireListComponent },
  { path: 'prestataire/view/:id', component: PrestataireViewComponent },
  { path: 'prestataire/edit', component: PrestataireEditComponent },
  { path: 'prestataire/edit/:id', component: PrestataireEditComponent },

  { path: 'accueil', component: AccueilComponent },
  { path: 'charte', component: CharteComponent },
  { path: 'about', component: AboutComponent },
  { path: 'conditions', component: ConditionsComponent },
  { path: '**', redirectTo: 'accueil' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
