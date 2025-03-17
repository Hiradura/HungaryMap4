import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { CardService } from '../card.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  loggedUser: any = null;
  editMode = false;
  editedDisplayName = '';
  comments: any[] = [];
  orders: any[] = [];

  // Lapozás változók
  currentPage = 1;
  commentsPerPage = 5;

  constructor(
    private auth: AuthService,
    private cardService: CardService,
    private baseService: BaseService
  ) {
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.loggedUser = user;
        this.editedDisplayName = user.displayName || '';
        this.loadUserComments(user.email);
        this.loadOrders(user.email);
      }
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

  loadUserComments(email: string): void {
    this.baseService.getCommentsByUser(email).subscribe(
      (userComments: any[]) => {
        this.comments = userComments;
      },
      (error) => console.error('Hiba a kommentek betöltésekor:', error)
    );
  }

  loadOrders(email: string) {
    this.cardService.getOrdersByUser(email).subscribe(
      (orders: any) => {
        this.orders = orders;
      },
      (error) => console.error('Hiba a rendelési előzmények betöltésekor:', error)
    );
  }

  // Lapozás
  get paginatedComments() {
    const start = (this.currentPage - 1) * this.commentsPerPage;
    return this.comments.slice(start, start + this.commentsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.commentsPerPage < this.comments.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
