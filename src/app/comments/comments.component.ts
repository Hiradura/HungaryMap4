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
      this.currentHelysegnev = params.get('helysegnev') || '';
      this.loadComments(); 
    });


    this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.commentData.Email = user.email || '';  
        this.commentData.displayName = user.displayName || 'Névtelen'; 
      }
    });
  }

  
  generateId(): string {
    return Math.random().toString(36).substr(2, 9); 
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
  deleteComment(postId: string): void {
    if (postId) {
     {
        this.commentService.deleteComment(postId).subscribe(
          () => {
            this.loadComments();
          },
          error => {
            console.error('Hiba a komment törlésénél:', error);
          }
        );
      }
    } else {
      console.error('Nincs megadva komment ID');
    }
  }
  
  loadComments(): void {
    this.commentService.getComments().subscribe(
      (data: any) => {
        this.comments = Object.keys(data).map(key => {
          return { id: key, ...data[key] };
        });
      },
      error => {
        console.error('Hiba a kommentek betöltésekor:', error);
      }
    );
  }
}