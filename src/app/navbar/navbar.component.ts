import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  word: string = '';
  user: any = null;

  constructor(private authService: AuthService, public router: Router, private search: SearchService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    this.search.getSearchWord().subscribe(res => {
      this.word = res;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onKeyUp(event: any) {
    this.search.setSearchWord(event.target.value);
  }
}
