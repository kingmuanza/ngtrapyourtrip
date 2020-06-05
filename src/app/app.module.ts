import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

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
    AccueilTransportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ChartsModule,
  ],
  providers: [],
})
export class AppModule { }
