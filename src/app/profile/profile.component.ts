import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  loggedUser: any;
  editMode = false;
  editedDisplayName = '';
  editedDisplayEmail = '';

  constructor(private auth: AuthService) {
    this.auth.getCurrentUser().subscribe(user => {
      this.loggedUser = user;
      this.editedDisplayName = user?.displayName || '';
      this.editedDisplayEmail = user?.email
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.editedDisplayName.trim()) {
      this.auth.updateUserProfile({ displayName: this.editedDisplayName }).then(() => {
        this.loggedUser.displayName = this.editedDisplayName;
        this.editMode = false;
        console.log('Profil sikeresen frissítve!');
      }).catch(error => {
        console.error('Hiba a profil mentése közben:', error);
      });
    }
  }
}
