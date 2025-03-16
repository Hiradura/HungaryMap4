import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentLang: any;
  email: string = '';
  password: string = '';           
  confirmPassword: string = '';     
  displayName: string = '';        
  emailError: string = '';         
  passwordError: string = '';       
  confirmPasswordError: string = ''; // Hozzáadva a jelszó megerősítéséhez kapcsolódó hiba
  registrationSuccess: boolean = false; // Regisztráció sikerességét jelző változó

  constructor(private translate: TranslateService, private authService: AuthService, private router: Router) {
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

  validateEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.email);
  }

  validatePassword(): boolean {
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'A jelszavak nem egyeznek!';
      return false;
    } else if (this.password.length < 6) {
      this.passwordError = 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
      return false;
    }
    this.passwordError = '';
    this.confirmPasswordError = '';
    return true;
  }

  register() {
    if (!this.validateEmail()) {
      this.emailError = 'Hibás email cím!';
      return;
    } else {
      this.emailError = '';
    }

    if (!this.validatePassword()) {
      return;
    }

    this.authService.register(this.email, this.password, this.displayName)
      .then(res => {
        this.registrationSuccess = true;
        this.router.navigate(['/login']); 
      })
      .catch(err => {
        console.error("Hiba történt!", err);
      });
  }

  registerWithGoogle() {
    this.authService.loginWithGoogle()
      .then(res => console.log("Sikeres Google bejelentkezés!", res))
      .catch(err => console.error("Hiba történt!", err.message));
  }
}
