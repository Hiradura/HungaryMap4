
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  loggedUser: any;
  private userSub = new BehaviorSubject<any>(null);
  private adminSub = new BehaviorSubject<boolean>(false);
  private loggedUserSub = new BehaviorSubject<boolean>(false);
  private loggedUserSubject = new BehaviorSubject<firebase.User | null>(null);

  private apiUrl="http://127.0.0.1:5001/magyarorszagmap/us-central1/api/"

  constructor(private afAuth: AngularFireAuth, private router: Router, private http:HttpClient) {
        this.afAuth.authState.subscribe(
          (user:any)=>{
            if (user){
              this.loggedUser=user?._delegate
              console.log("User", user)
              user.getIdToken().then(
                (token: any) => {
                  this.loggedUser.accessToken = token
                  const headers = new HttpHeaders().set('Authorization', token)
                  this.http.get(this.apiUrl + "getClaims/" + user.uid, { headers }).subscribe(
                    {
                      next: (claims) => {
                        console.log("Claims", claims)
                        this.loggedUser.claims = claims
                        this.userSub.next(this.loggedUser)
                        this.adminSub.next(this.loggedUser.claims.admin)
                        this.loggedUserSub.next(true)
                        console.log("User: ", this.loggedUser)
                      },
                      error: (error) => {
                        console.log(error)
                        this.loggedUser = null
                        this.userSub.next(null)
                        this.adminSub.next(false)
                        this.loggedUserSub.next(false)
                      }
                    }
                  )
              })
              .catch(
              (error:any)=>console.error(error)
              )
            }
            else {
              this.loggedUser=null
              this.userSub.next(null)
              this.adminSub.next(false)
              this.loggedUserSub.next(false)
            }
          }
        )
    
    this.afAuth.authState.subscribe(user => {
      this.loggedUserSubject.next(user);
    });
  }
  getUsers() {
    if (this.loggedUser.accessToken) {
      const headers = new HttpHeaders().set(
        'Authorization',
        this.loggedUser.accessToken
      );
      return this.http.get(this.apiUrl + 'users', { headers });
    }
    return null;
  }
  setUserClaims(uid: any, claims: any) {
    if (this.loggedUser.accessToken) {
      let body = {
        claims: claims,
        uid: uid,
      };
      const headers = new HttpHeaders().set(
        'Authorization',
        this.loggedUser.accessToken
      );
      return this.http.post(this.apiUrl + 'setCustomClaims', body, { headers });
    }
    return null;
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
      signUpMailPassword(email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password).then(() => {
      this.afAuth.currentUser
        .then((user) => {
          user?.sendEmailVerification();
        })
        .then(() => this.logout())
        .then(() => this.router.navigate(['verifymail']))
        .catch((e) => alert(e));
    });
  }
  isLoggedIn(): boolean {
    return !!this.afAuth.currentUser;
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
    });
  }

  getIsAdmin(){
    return this.adminSub
  }
  getIsLoggedUser() {
    return this.loggedUserSub;
  }
  getLoggedUser() {
    return this.userSub;
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
  getCurrentUserState() {
    return this.afAuth.authState;
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

    updateUser(displayName: any, phoneNumber: any, email: any) {
    if (this.loggedUser.accessToken) {
      let body = { displayName, phoneNumber, email };
      const headers = new HttpHeaders().set(
        'Authorization',
        this.loggedUser.accessToken
      );
      return this.http.patch(this.apiUrl + 'updateUser/', body, { headers });
    }
    return null;
  }
  forgotPassword(email: any) {
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => console.log('mail elküldve!'));
  }
}




