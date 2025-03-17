import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  currentLang: any;
  email: string = '';
  password: string = '';

  constructor(
    private translate: TranslateService, 
    private authService: AuthService, 
    private router: Router
  ) {
    const en = {
      "LOGIN": {
        "TITLE": "Login",
        "EMAIL": "Email",
        "EMAIL_PLACEHOLDER": "Enter your email",
        "PASSWORD": "Password",
        "PASSWORD_PLACEHOLDER": "Enter your password",
        "SUBMIT": "Login",
        "REMEMBER_ME": "Remember me",
        "FORGOT_PASSWORD": "Forgot password?",
        "REGISTER": "Don't have an account? Register"
      }
    };

    const hu = {
      "LOGIN": {
        "TITLE": "Bejelentkezés",
        "EMAIL": "Email",
        "EMAIL_PLACEHOLDER": "Add meg a email címed",
        "PASSWORD": "Jelszó",
        "PASSWORD_PLACEHOLDER": "Add meg a jelszavad",
        "SUBMIT": "Bejelentkezés",
        "REMEMBER_ME": "Emlékezz rám",
        "FORGOT_PASSWORD": "Elfelejtetted a jelszavad?",
        "REGISTER": "Nincs még fiókod? Regisztrálj"
      }
    };

    translate.setTranslation('en', en, true);
    translate.setTranslation('hu', hu, true);
    translate.setDefaultLang('hu');
    translate.use('hu');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  login() {
    if (!this.email || !this.password) {
      console.error("Adj meg egy e-mailt és egy jelszót!");
      return;
    }

    this.authService.login(this.email, this.password)
      .then(res => {
        console.log("Sikeres bejelentkezés!", res);
        this.router.navigate(['/map']);
      })
      .catch(err => console.error("Hiba történt!", err.message));
  }

  register() {
    if (!this.email || !this.password) {
      console.error("Adj meg egy e-mailt és egy jelszót!");
      return;
    }
  
    const displayName = 'Felhasználó neve';
  
    this.authService.register(this.email, this.password, displayName)
      .then(res => {
        console.log("Sikeres regisztráció!", res);
        this.router.navigate(['/map']);
      })
      .catch(err => console.error("Regisztrációs hiba:", err.message));
  }
  
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(res => {
        console.log("Sikeres Google bejelentkezés!", res);
        this.router.navigate(['/map']);
      })
      .catch(err => console.error("Hiba történt!", err.message));
  }
}
