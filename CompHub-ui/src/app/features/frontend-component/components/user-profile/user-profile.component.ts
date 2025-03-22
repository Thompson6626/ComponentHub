import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, tap} from 'rxjs';
import {LoadingState, State} from '../../../../shared/models/loading-state';
import {withLoadingState} from '../../../../shared/utils/rxjs-utils';
import {ComponentShowcase} from '../../models/component/component-showcase';
import {ComponentService} from '../../services/ui-component/component.service';
import {PageResponse} from '../../../../shared/models/page-response';
import {UserService} from '../../../user/services/user.service';
import {ToastService} from '../../../../core/services/Toast/toast.service';
import {ConfirmationService} from 'primeng/api';
import {AsyncPipe, DatePipe, NgOptimizedImage} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {AuthStateService} from '../../../../core/services/AuthState/auth-state.service';
import {UserPublicDetails} from '../../../../shared/models/user-public-details';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-user-profile',
  imports: [
    DatePipe,
    AsyncPipe,
    ProgressSpinner,
    RouterLink,
    FormsModule,
    InputText,
    IconField,
    InputIcon,
    Paginator,
    ConfirmDialog,
    NgOptimizedImage
  ],
  providers: [ConfirmationService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.sass'
})
export class UserProfileComponent implements OnInit {

  /** Constants **/
  private readonly defaultParams = { page: 0, size: 12 };

  /** Injected Dependencies **/
  private activatedRoute = inject(ActivatedRoute);
  private componentService = inject(ComponentService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  authStateService = inject(AuthStateService);

  /** Public & Protected Properties **/
  protected readonly State = State;

  userData$!: Observable<LoadingState<UserPublicDetails>>;
  userComponents$: Observable<LoadingState<PageResponse<ComponentShowcase>>> | null = null;

  profileUsername?: string;
  searchQuery: string = '';
  page: number = this.defaultParams.page;
  size: number = this.defaultParams.size;
  first = 0;
  totalPages = 0;
  totalItems = 0;

  /**  Lifecycle Hook: Initializes Data **/
  ngOnInit(): void {
    this.handleRouteParams();
  }

  /**  Handles Route Parameters & Fetches Data **/
  private handleRouteParams(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const username = params.get('username');

      if (!username) {
        this.userData$ = of({ state: State.Error, error: new Error("User doesn't exist") });
      } else {
        this.profileUsername = username;
        this.fetchUserData();
      }
    });

    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      this.searchQuery = queryParams.get('q') || '';
      this.page = parseInt(queryParams.get('page') || `${this.defaultParams.page}`, 10);
      this.size = parseInt(queryParams.get('size') || `${this.defaultParams.size}`, 10);

      if (this.profileUsername) {
        this.fetchUserComponents();
      }
    });
  }

  /** Fetches User Data **/
  private fetchUserData(): void {
    this.userData$ = this.userService.getUserDetails(this.profileUsername!)
      .pipe(withLoadingState());

    this.fetchUserComponents();
  }

  /** Fetches User's Components **/
  private fetchUserComponents(): void {
    if (!this.profileUsername) return;

    this.userComponents$ = this.componentService.getByUsername(this.profileUsername,this.searchQuery,{
      page: this.page,
      size: this.size
    }).pipe(
      tap( response => {
        this.page = response.number;
        this.size = response.size;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;

        if (this.page >= response.totalPages) {
          this.page = Math.max(0, response.totalPages - 1);
          this.updateUrl();
        }
      }),
      withLoadingState()
    )
  }

  /**  Deletes a Component (With Confirmation) **/
  deleteConfirm(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this component?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => this.delete(id)
    });
  }

  /** Deletes a Component & Refreshes List **/
  private delete(id: number): void {
    this.componentService.delete(id).subscribe({
      next: () => {
        this.toastService.showSuccessToast("Success", "Component deleted successfully.");
        this.fetchUserComponents();
      },
      error: () => this.toastService.showErrorToast("Error", "Failed to delete component.")
    });
  }

  /** Updates URL (Method Placeholder) **/
  updateUrl(): void {
    const queryParams: any = {};

    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.page !== this.defaultParams.page) queryParams.page = this.page;
    if (this.size !== this.defaultParams.size) queryParams.size = this.size;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  onPageChange(state: PaginatorState): void {
    if (state.page !== this.page || state.rows !== this.size) {
      this.page = state.page ?? this.page;
      this.first = state.first ?? this.first;
      this.totalPages = state.pageCount ?? this.totalPages;
      this.updateUrl();
    }
  }

}

