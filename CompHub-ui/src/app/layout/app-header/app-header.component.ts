import {Component, inject, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthStateService} from '../../core/services/AuthState/auth-state.service';
import {AsyncPipe} from '@angular/common';
import {SplitButton} from 'primeng/splitbutton';
import {AuthService} from '../../features/authentication/services/Auth/auth.service';
import { SearchStateService } from '../../core/services/SearchState/search-state.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    AsyncPipe,
    SplitButton,
    FormsModule
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.sass'
})
export class AppHeaderComponent implements OnInit {
  items!: MenuItem[];

  authStateService = inject(AuthStateService);
  private authService = inject(AuthService);
  private searchStateService = inject(SearchStateService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery: string = '';

  ngOnInit(): void {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['/user',this.authStateService.getCurrentUserDetails()?.username],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/profile/settings']
      },
      { separator:true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          console.log('Logout');
          this.authService.logout(true);
        }
      }
    ];


    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.searchStateService.searchQuery = this.searchQuery;
    });
  }


  async onSearch(query: string) {
    this.searchStateService.searchQuery = query; // Update global state

    const currentRoute = this.activatedRoute.snapshot.routeConfig?.path;
    const queryParams = { q: query };

    await this.router.navigate(currentRoute === 'search' ? [] : ['/search'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

}
