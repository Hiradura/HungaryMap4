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

  register(email: string, password: string, displayName: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        if (cred.user) {
          return cred.user.updateProfile({ displayName: displayName }).then(() => {
            this.loggedUserSubject.next(cred.user);
            this.router.navigate(['/login']);
          });
        }
        return Promise.reject('Felhasználó nem található.');
      })
      .catch(error => {
        console.error("Regisztrációs hiba:", error);
        throw error;
      });
  }

  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(cred => {
      if (cred.user) {
        this.loggedUserSubject.next(cred.user);
      }
    }).catch(error => {
      console.error("Bejelentkezési hiba:", error);
      throw error;
    });
  }

  loginWithGoogle(): Promise<void> {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(cred => {
      if (cred.user) {
        this.loggedUserSubject.next(cred.user);
      }
    }).catch(error => {
      console.error("Google bejelentkezési hiba:", error);
      throw error;
    });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.loggedUserSubject.next(null);
      this.router.navigate(['/map']);
    }).catch(error => {
      console.error("Kilépési hiba:", error);
      throw error;
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
    }).catch(error => {
      console.error("Profil frissítési hiba:", error);
      throw error;
    });
  }
}
