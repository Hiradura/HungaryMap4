import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SettlementsComponent } from './settlements/settlements.component';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { ProfileComponent } from './profile/profile.component';
import { NogradComponent } from './nograd/nograd.component';
import { BudapestComponent } from './budapest/budapest.component';
import { PestComponent } from './pest/pest.component';
import { BacskicskunComponent } from './bacskicskun/bacskicskun.component';
import { BalatonComponent } from './balaton/balaton.component';
import { WebshopComponent } from './webshop/webshop.component';
import { CardComponent } from './card/card.component';
import { OrderComponent } from './order/order.component';
import { LoggedInGuard } from './logged-user.guard';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './admin.guard';

const routes: Routes = [
  { path: 'balaton', component: BalatonComponent },
  { path: 'bács-kiskun', component: BacskicskunComponent },
  { path: 'pest', component: PestComponent },
  { path: 'budapest', component: BudapestComponent },
  { path: 'nógrád', component: NogradComponent },
  { path: 'map', component: MapComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'side-panel', component: SidePanelComponent },
  { path: 'settlements', component: SettlementsComponent },
  { path: 'shop', component: WebshopComponent },
  { path: 'card', component: CardComponent },
  { path: 'order', component: OrderComponent, canActivate: [LoggedInGuard] },
  { path: 'comments', component: CommentsComponent, canActivate: [LoggedInGuard] },
  { path: 'comments/:helysegnev', component: CommentsComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'admin', component:AdminComponent, canActivate:[adminGuard]},
  { path: '', redirectTo: '/map', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
