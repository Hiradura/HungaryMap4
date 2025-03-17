import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  loggedUser: any;
  users: any;
  
  constructor(private auth: AuthService, private crud: BaseService, private router:Router) {
    this.auth.getLoggedUser().subscribe(
      (loggedUser) => {
        this.loggedUser = loggedUser;
        console.log('Users logged', this.loggedUser);
        if (this.loggedUser) this.auth.getUsers()?.subscribe(
          (users) => this.users = users
        )
      }
    )
  }

  setCustomClaims(uid: any, claims: any) {
    this.auth.setUserClaims(uid, claims)?.subscribe(
      () => console.log('Claims beállítás!')
    )
  }

  change(uid: any) {
    let tomb = this.users.filter(
      (elem: any) => elem.uid == uid
    )
    console.log(tomb);
    this.auth.setUserClaims(uid, tomb[0].claims)?.subscribe();
  }
}
