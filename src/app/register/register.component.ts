import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  currentLang: any;
  email: string = '';
  password: string = '';
  constructor(private translate: TranslateService, private authService: AuthService) {
    const en = {
      "REGISTER": {
        "TITLE": "Register",
        "USERNAME": "Username",
        "USERNAME_PLACEHOLDER": "Enter your username",
        "EMAIL": "Email",
        "EMAIL_PLACEHOLDER": "Enter your email",
        "PASSWORD": "Password",
        "PASSWORD_PLACEHOLDER": "Enter your password",
        "CONFIRM_PASSWORD": "Confirm Password",
        "CONFIRM_PASSWORD_PLACEHOLDER": "Confirm your password",
        "SUBMIT": "Register",
        "ALREADY_HAVE_ACCOUNT": "Already have an account? Login"
      }
    };

    const hu = {
      "REGISTER": {
        "TITLE": "Regisztráció",
        "USERNAME": "Felhasználónév",
        "USERNAME_PLACEHOLDER": "Add meg a felhasználóneved",
        "EMAIL": "Email",
        "EMAIL_PLACEHOLDER": "Add meg az email címed",
        "PASSWORD": "Jelszó",
        "PASSWORD_PLACEHOLDER": "Add meg a jelszavad",
        "CONFIRM_PASSWORD": "Jelszó megerősítése",
        "CONFIRM_PASSWORD_PLACEHOLDER": "Erősítsd meg a jelszavad",
        "SUBMIT": "Regisztráció",
        "ALREADY_HAVE_ACCOUNT": "Már van fiókod? Jelentkezz be"
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
  register() {
    this.authService.register(this.email, this.password)
      .then(res => console.log("Sikeres regisztráció!", res))
      .catch(err => console.error("Hiba történt!", err));
  }
  registerWithGoogle() {
    this.authService.loginWithGoogle()
      .then(res => console.log("Sikeres Google bejelentkezés!", res))
      .catch(err => console.error("Hiba történt!", err.message));
  }
}
