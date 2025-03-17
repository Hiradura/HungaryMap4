import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CommentsComponent } from './comments/comments.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule, IMAGE_CONFIG } from '@angular/common';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { ProfileComponent } from './profile/profile.component';
import { SidePanelCityComponent } from './side-panel-city/side-panel-city.component';
import { SearchPipe } from './search.pipe';
import { NogradComponent } from './nograd/nograd.component';
import { BudapestComponent } from './budapest/budapest.component';
import { PestComponent } from './pest/pest.component';
import { BacskicskunComponent } from './bacskicskun/bacskicskun.component';
import { BalatonComponent } from './balaton/balaton.component';
import { WebshopComponent } from './webshop/webshop.component';
import { CardComponent } from './card/card.component';
import { OrderComponent } from './order/order.component';
import { SettlementsComponent } from './settlements/settlements.component';
import { AdminComponent } from './admin/admin.component';






@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CommentsComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    SidePanelComponent,
    ProfileComponent,
    SidePanelCityComponent,
    SearchPipe,
    NogradComponent,
    BudapestComponent,
    PestComponent,
    BacskicskunComponent,
    BalatonComponent,
    WebshopComponent,
    CardComponent,
    OrderComponent,
    SettlementsComponent,
    AdminComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot(),
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    CommonModule,

  ],
  providers: [provideHttpClient(),{
    provide: IMAGE_CONFIG,
    useValue: {
      disableImageSizeWarning: true, 
      disableImageLazyLoadWarning: true
    }
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private translate: TranslateService){
    translate.setDefaultLang('hu');
    translate.use('hu'); 
  }
}
