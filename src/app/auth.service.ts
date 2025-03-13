import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUserSubject = new BehaviorSubject<firebase.User | null>(null);

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      this.loggedUserSubject.next(user);
    });
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(cred => {
      if (cred.user) {
        this.loggedUserSubject.next(cred.user);
      }
    });
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(cred => {
      if (cred.user) {
        this.loggedUserSubject.next(cred.user);
      }
    });
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(cred => {
      if (cred.user) {
        this.loggedUserSubject.next(cred.user);
      }
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.loggedUserSubject.next(null);
      this.router.navigate(['/map']);
    });
  }

  getCurrentUser(): Observable<any> {
    return this.loggedUserSubject.asObservable().pipe(
      map(user => user ? { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName || 'Névtelen'
      } : null)
    );
  }

  updateUserProfile(profileData: { displayName?: string }): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.updateProfile({ displayName: profileData.displayName ?? null }).then(() => {
          this.loggedUserSubject.next({ ...user, displayName: profileData.displayName ?? null });
        });
      } else {
        return Promise.reject('Nincs bejelentkezett felhasználó.');
      }
    });
  }
}
