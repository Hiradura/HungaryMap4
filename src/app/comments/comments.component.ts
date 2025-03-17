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

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentHelysegnev = params.get('helysegnev') || 'Csevegő'; 
      this.commentData.Helysegnev = this.currentHelysegnev; 
      this.loadComments();
    });

    this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.commentData.Email = user.email || '';  
        this.commentData.displayName = user.displayName || 'Névtelen'; 
        this.loadUserComments(user.email);
      }
    });
  }

  postComment(): void {
    const newComment = {
      ...this.commentData,
      createdAt: new Date().toISOString(),
    };

    this.commentService.createComment(newComment).subscribe(() => {
      this.loadComments();
    });
  }

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

  loadComments(): void {
    this.commentService.getComments().subscribe(
      (data: any) => {
        this.comments = Object.keys(data).map(key => {
          const comment = { id: key, ...data[key] };
          if (comment.Helysegnev === this.currentHelysegnev) {
            return comment;
          }
        }).filter(Boolean);
      },
      error => {
        console.error('Hiba a kommentek betöltésekor:', error);
      }
    );
  }
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
}
