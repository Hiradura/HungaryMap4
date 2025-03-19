import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  word: string = '';
  user: any = null;
  moderator: any = null
  admin: any = null 

  constructor(private authService: AuthService, public router: Router, private search: SearchService) {}
  isDropdownOpen = false;

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
    this.authService.getIsAdmin().subscribe(admin => {
      this.admin = admin
    })}
    toggleDropdown(state: boolean) {
      this.isDropdownOpen = state;
    }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onKeyUp(event: any) {
    this.search.setSearchWord(event.target.value);
  }
}
