import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { DivertissementListComponent } from './pages/divertissement/divertissement-list/divertissement-list.component';
import { DivertissementViewComponent } from './pages/divertissement/divertissement-view/divertissement-view.component';
import { DivertissementEditComponent } from './pages/divertissement/divertissement-edit/divertissement-edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HebergementListComponent } from './pages/hebergement/hebergement-list/hebergement-list.component';
import { HebergementViewComponent } from './pages/hebergement/hebergement-view/hebergement-view.component';
import { HebergementEditComponent } from './pages/hebergement/hebergement-edit/hebergement-edit.component';
import { PanierComponent } from './pages/panier/panier.component';
import { SejourListComponent } from './pages/sejour/sejour-list/sejour-list.component';
import { SejourViewComponent } from './pages/sejour/sejour-view/sejour-view.component';
import { SejourEditComponent } from './pages/sejour/sejour-edit/sejour-edit.component';
import { TransportEditComponent } from './pages/transport/transport-edit/transport-edit.component';
import { TransportViewComponent } from './pages/transport/transport-view/transport-view.component';
import { TransportListComponent } from './pages/transport/transport-list/transport-list.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { MenuHautComponent } from './components/menu-haut/menu-haut.component';
import { CarouselComponent } from './pages/accueil/carousel/carousel.component';
import { AccueilSejoursComponent } from './pages/accueil/accueil-sejours/accueil-sejours.component';
import { AccueilDivertissementsComponent } from './pages/accueil/accueil-divertissements/accueil-divertissements.component';
import { NewsLetterComponent } from './pages/accueil/news-letter/news-letter.component';
import { FooterComponent } from './components/footer/footer.component';
import { RechercherComponent } from './pages/rechercher/rechercher.component';
import { DisplaySejourComponent } from './components/display-sejour/display-sejour.component';
import { ConsoleComponent } from './pages/administration/console/console.component';
import { AdminConnexionComponent } from './pages/administration/admin-connexion/admin-connexion.component';
import { PaiementListComponent } from './pages/paiement/paiement-list/paiement-list.component';
import { PaiementEditComponent } from './pages/paiement/paiement-edit/paiement-edit.component';
import { PaiementViewComponent } from './pages/paiement/paiement-view/paiement-view.component';
import { RubriquesComponent } from './pages/accueil/rubriques/rubriques.component';
import { DisplayHebergementComponent } from './components/display-hebergement/display-hebergement.component';
import { AccueilHebergementsComponent } from './pages/accueil/accueil-hebergements/accueil-hebergements.component';
import { ReservationListComponent } from './pages/reservation/reservation-list/reservation-list.component';
import { ReservationEditComponent } from './pages/reservation/reservation-edit/reservation-edit.component';
import { ReservationViewComponent } from './pages/reservation/reservation-view/reservation-view.component';
import { DisplayDivertissementComponent } from './components/display-divertissement/display-divertissement.component';
import { DisplayTransportComponent } from './components/display-transport/display-transport.component';
import { AccueilTransportsComponent } from './pages/accueil/accueil-transports/accueil-transports.component';
import { HebergementListEditComponent } from './pages/hebergement/hebergement-list-edit/hebergement-list-edit.component';
import { HebergementEditOldComponent } from './pages/hebergement/hebergement-edit-old/hebergement-edit-old.component';
import { PrestataireListComponent } from './pages/prestataire/prestataire-list/prestataire-list.component';
import { PrestataireViewComponent } from './pages/prestataire/prestataire-view/prestataire-view.component';
import { PrestataireEditComponent } from './pages/prestataire/prestataire-edit/prestataire-edit.component';
import { PrestataireCreateComponent } from './pages/prestataire/prestataire-create/prestataire-create.component';
import { PrestataireListEditComponent } from './pages/prestataire/prestataire-list-edit/prestataire-list-edit.component';
import { ReservationInfosComponent } from './pages/reservation/reservation-infos/reservation-infos.component';
import { ReservationRecapComponent } from './pages/reservation/reservation-recap/reservation-recap.component';
import { PhotoComponent } from './pages/inscription/photo/photo.component';
import { MonprofilComponent } from './pages/monprofil/monprofil.component';
import { MoncompteComponent } from './pages/moncompte/moncompte.component';
import { DisplayPrestataireComponent } from './components/display-prestataire/display-prestataire.component';
import { OubliComponent } from './pages/oubli/oubli.component';
import { TrajetListComponent } from './pages/transport/trajet/trajet-list/trajet-list.component';
import { TrajetEditComponent } from './pages/transport/trajet/trajet-edit/trajet-edit.component';
import { TrajetViewComponent } from './pages/transport/trajet/trajet-view/trajet-view.component';
import { AgenceEditComponent } from './pages/transport/agence/agence-edit/agence-edit.component';
import { AgenceViewComponent } from './pages/transport/agence/agence-view/agence-view.component';
import { AgenceListComponent } from './pages/transport/agence/agence-list/agence-list.component';
import { DepartViewComponent } from './pages/transport/depart/depart-view/depart-view.component';
import { DepartListComponent } from './pages/transport/depart/depart-list/depart-list.component';
import { DepartEditComponent } from './pages/transport/depart/depart-edit/depart-edit.component';
import { LocationListComponent } from './pages/transport/location/location-list/location-list.component';
import { LocationEditComponent } from './pages/transport/location/location-edit/location-edit.component';
import { LocationViewComponent } from './pages/transport/location/location-view/location-view.component';
import { DivertissementChoixComponent } from './pages/divertissement/divertissement-choix/divertissement-choix.component';
import { LoisirListComponent } from './pages/divertissement/loisir-list/loisir-list.component';
import { LoisirViewComponent } from './pages/divertissement/loisir-view/loisir-view.component';
import { LoisirEditComponent } from './pages/divertissement/loisir-edit/loisir-edit.component';
import { DisplayLoisirComponent } from './components/display-loisir/display-loisir.component';
import { RestaurantListComponent } from './pages/divertissement/restaurant-list/restaurant-list.component';
import { RestaurantViewComponent } from './pages/divertissement/restaurant-view/restaurant-view.component';
import { VilleComponent } from './pages/accueil/ville/ville.component';
import { AdminComponent } from './components/admin/admin.component';
import { AboutComponent } from './pages/about/about.component';
import { ConditionsComponent } from './pages/conditions/conditions.component';
import { CharteComponent } from './pages/charte/charte.component';
import { TransportChoixComponent } from './pages/transport/transport-choix/transport-choix.component';
import { TransportLocationListComponent } from './pages/transport/transport-location-list/transport-location-list.component';
import { TransportLocationViewComponent } from './pages/transport/transport-location-view/transport-location-view.component';
import { CancelComponent } from './pages/paiement/cancel/cancel.component';
import { HttpClientModule } from '@angular/common/http';
import { ReturnComponent } from './pages/paiement/return/return.component';
import { DisplayRestaurantComponent } from './components/display-restaurant/display-restaurant.component';
import { DisplayVoitureComponent } from './components/display-voiture/display-voiture.component';
import { DisplayDivertissementItemComponent } from './components/display-divertissement-item/display-divertissement-item.component';
import { DivertissementItemViewComponent } from './pages/divertissement/divertissement-item-view/divertissement-item-view.component';
import { DisplayReservationDescriptionComponent } from './components/display-reservation-description/display-reservation-description.component';
import { DisplayAgenceComponent } from './components/display-agence/display-agence.component';
import { GareEditComponent } from './pages/transport/gare/gare-edit/gare-edit.component';
import { GareListComponent } from './pages/transport/gare/gare-list/gare-list.component';
import { GareViewComponent } from './pages/transport/gare/gare-view/gare-view.component';
import { DisplayGareComponent } from './components/display-gare/display-gare.component';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AccueilComponent,
    DivertissementListComponent,
    DivertissementViewComponent,
    DivertissementEditComponent,
    DashboardComponent,
    HebergementListComponent,
    HebergementViewComponent,
    HebergementEditComponent,
    PanierComponent,
    SejourListComponent,
    SejourViewComponent,
    SejourEditComponent,
    TransportEditComponent,
    TransportViewComponent,
    TransportListComponent,
    ConnexionComponent,
    InscriptionComponent,
    MenuHautComponent,
    CarouselComponent,
    AccueilSejoursComponent,
    AccueilDivertissementsComponent,
    NewsLetterComponent,
    FooterComponent,
    RechercherComponent,
    DisplaySejourComponent,
    ConsoleComponent,
    AdminConnexionComponent,
    PaiementListComponent,
    PaiementEditComponent,
    PaiementViewComponent,
    RubriquesComponent,
    DisplayHebergementComponent,
    AccueilHebergementsComponent,
    ReservationListComponent,
    ReservationEditComponent,
    ReservationViewComponent,
    DisplayDivertissementComponent,
    DisplayTransportComponent,
    AccueilTransportsComponent,
    HebergementListEditComponent,
    HebergementEditOldComponent,
    PrestataireListComponent,
    PrestataireViewComponent,
    PrestataireEditComponent,
    PrestataireCreateComponent,
    PrestataireListEditComponent,
    ReservationInfosComponent,
    ReservationRecapComponent,
    PhotoComponent,
    MonprofilComponent,
    MoncompteComponent,
    DisplayPrestataireComponent,
    OubliComponent,
    TrajetListComponent,
    TrajetEditComponent,
    TrajetViewComponent,
    AgenceEditComponent,
    AgenceViewComponent,
    AgenceListComponent,
    DepartViewComponent,
    DepartListComponent,
    DepartEditComponent,
    LocationListComponent,
    LocationEditComponent,
    LocationViewComponent,
    DivertissementChoixComponent,
    LoisirListComponent,
    LoisirViewComponent,
    LoisirEditComponent,
    DisplayLoisirComponent,
    RestaurantListComponent,
    RestaurantViewComponent,
    VilleComponent,
    AdminComponent,
    AboutComponent,
    ConditionsComponent,
    CharteComponent,
    TransportChoixComponent,
    TransportLocationListComponent,
    TransportLocationViewComponent,
    CancelComponent,
    ReturnComponent,
    DisplayRestaurantComponent,
    DisplayVoitureComponent,
    DisplayDivertissementItemComponent,
    DivertissementItemViewComponent,
    DisplayReservationDescriptionComponent,
    DisplayAgenceComponent,
    GareEditComponent,
    GareListComponent,
    GareViewComponent,
    DisplayGareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ChartsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    }
  ],
})
export class AppModule { }
