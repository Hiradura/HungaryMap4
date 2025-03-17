import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  standalone: false
})
export class CommentsComponent implements OnInit {
  comments: any[] = [];
  commentData = { id: null, Helysegnev: '', Comment: '', Email: '', displayName: '' };
  user: any;
  currentHelysegnev: string = '';
  currentPage: number = 1;  // Kezdő oldal
  totalPages: number = 1;  // Összes oldal száma
  commentsPerPage: number = 10;  // Egy oldalon lévő kommentek száma

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Helységnév paraméterének beállítása
    this.route.paramMap.subscribe(params => {
      this.currentHelysegnev = params.get('helysegnev') || 'Csevegő';
      this.commentData.Helysegnev = this.currentHelysegnev;
      this.loadComments();
    });

    // Aktuális felhasználó adatainak betöltése
    this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.commentData.Email = user.email || '';  
        this.commentData.displayName = user.displayName || 'Névtelen'; 
        this.loadUserComments(user.email);
      }
    });
  }

  // Komment küldése
  postComment(): void {
    const newComment = {
      ...this.commentData,
      createdAt: new Date().toISOString(),
    };

    this.commentService.createComment(newComment).subscribe(() => {
      this.loadComments();
    });
  }

  // Komment törlése
  deleteComment(postId: string, commentEmail: string): void {
    if (postId) {
      if (this.user && this.user.email === commentEmail) {  
        this.commentService.deleteComment(postId).subscribe(
          () => {
            this.loadComments();
          },
          error => {
            console.error('Hiba a komment törlésénél:', error);
          }
        );
      } else {
        console.error('Nem tudod törölni más kommentjét.');
      }
    } else {
      console.error('Nincs megadva komment ID');
    }
  }

  // Kommentek betöltése
  loadComments(): void {
    this.commentService.getComments().subscribe(
      (data: any) => {
        // Kommentelek szűrése a helységnév alapján
        const filteredComments = Object.keys(data).map(key => {
          const comment = { id: key, ...data[key] };
          if (comment.Helysegnev === this.currentHelysegnev) {
            return comment;
          }
        }).filter(Boolean);

        // Kommentelek beállítása és az oldalszám kiszámítása
        const startIndex = (this.currentPage - 1) * this.commentsPerPage;
        const endIndex = startIndex + this.commentsPerPage;
        this.comments = filteredComments.slice(startIndex, endIndex);
        this.totalPages = Math.ceil(filteredComments.length / this.commentsPerPage);
      },
      error => {
        console.error('Hiba a kommentek betöltésekor:', error);
      }
    );
  }

  // Felhasználói kommentek betöltése
  loadUserComments(email: string): void {
    this.commentService['getCommentsByUser'](email).subscribe(
      (userComments: any[]) => {
        console.log('Felhasználó kommentjei:', userComments);
      },
      (error: any) => { 
        console.error('Hiba a felhasználó kommentjeinek lekérésekor:', error);
      }
    );
  }

  // Oldal váltás
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadComments();
    }
  }
}
