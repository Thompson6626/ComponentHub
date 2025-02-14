import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ComponentShowcase} from '../../../models/component/component-showcase';
import {ComponentService} from '../../../services/ui-component/component.service';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Observable, tap} from 'rxjs';
import {LoadingState, State} from '../../../../../shared/models/loading-state';
import {ProgressSpinner} from 'primeng/progressspinner';
import { toLoadingStateStream } from '../../../../../shared/utils/rxjs-utils';
import {SearchStateService} from '../../../../../core/services/SearchState/search-state.service';
import {PageResponse} from '../../../../../shared/models/page-response';
import {CategoryService} from '../../../services/category/category.service';
import {CategoryResponse} from '../../../models/category/category-response';
import {Select, SelectChangeEvent} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Checkbox, CheckboxChangeEvent} from 'primeng/checkbox';
import {ComponentCardComponent} from '../component-card/component-card.component';

@Component({
  selector: 'app-component-list',
  imports: [
    Paginator,
    DatePipe,
    AsyncPipe,
    ProgressSpinner,
    RouterLink,
    Select,
    FormsModule,
    Checkbox,
    ComponentCardComponent
  ],
  templateUrl: './component-list.component.html',
  styleUrl: './component-list.component.sass'
})
export class ComponentListComponent implements OnInit {
  protected readonly State = State;

  private readonly defaultParams = {
    sortBy: 'upVotes',
    order: 'desc',
    page: 0,
    size: 12
  };

  defaultItemsValue = { label: "Rated", value: this.defaultParams.sortBy };
  defaultOrderValue = { label: "Descending", value: this.defaultParams.order };

  sortItems = [
    { label: "Rated", value: "upVotes" },
    { label: "Alphabetically", value: "name" },
    { label: "Recently created", value: "createdAt" },
    { label: "Recently updated", value: "updatedAt" },
  ];
  orderItems = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];

  componentPage$!: Observable<LoadingState<PageResponse<ComponentShowcase>>>;
  categoryList$!: Observable<LoadingState<CategoryResponse[]>>;

  activatedRoute = inject(ActivatedRoute);
  private componentService = inject(ComponentService);
  private searchStateService = inject(SearchStateService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  searchQuery = '';
  first = 0;
  sortBy?: string;
  order?: string;
  page = this.defaultParams.page;
  size = this.defaultParams.size;
  categoryNames: string[] = [];
  totalItems = 0;
  totalPages = 0;

  readonly pageSizeOptions = [12, 24, 36];

  ngOnInit(): void {
    this.categoryList$ = toLoadingStateStream(this.categoryService.getAll());

    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      this.searchQuery = queryParams.get('q') || '';
      this.page = parseInt(queryParams.get('page') || `${this.defaultParams.page}`, 10);
      this.size = parseInt(queryParams.get('size') || `${this.defaultParams.size}`, 10);
      this.sortBy = queryParams.get('sortBy') || undefined;
      this.order = queryParams.get('order') || undefined;
      this.categoryNames = queryParams.getAll('categories');

      this.fetchComponents();
    });

    this.searchStateService.searchQuery.subscribe(query => {
      if (this.searchQuery !== query) {
        this.searchQuery = query;
        this.updateUrl();
      }
    });
  }

  fetchComponents() {
    this.componentPage$ = toLoadingStateStream(
      this.componentService.search(this.searchQuery, {
        page: this.page,
        size: this.size,
        sortBy: this.sortBy,
        order: this.order,
        categoryNames: this.categoryNames,
      }).pipe(
        tap(response => {
          this.page = response.number;
          this.size = response.size;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalElements;

          if (this.page >= response.totalPages) {
            this.page = Math.max(0, response.totalPages - 1);
            this.updateUrl();
          }
        })
      )
    );
  }

  onPageChange(state: PaginatorState): void {
    if (state.page !== this.page || state.rows !== this.size) {
      this.page = state.page ?? this.page;
      this.size = state.rows ?? this.size;
      this.first = state.first ?? this.first;
      this.totalPages = state.pageCount ?? this.totalPages;
      this.updateUrl();
    }
  }

  updateUrl() {
    const queryParams: any = {};

    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.page !== this.defaultParams.page) queryParams.page = this.page;
    if (this.size !== this.defaultParams.size) queryParams.size = this.size;
    if (this.sortBy && this.sortBy !== this.defaultParams.sortBy) queryParams.sortBy = this.sortBy;
    if (this.order && this.order !== this.defaultParams.order) queryParams.order = this.order;
    if (this.categoryNames.length > 0) queryParams.categories = this.categoryNames;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  updateSortBy(event: SelectChangeEvent) {
    this.sortBy = event.value.value === this.defaultParams.sortBy ? undefined : event.value.value;
    this.updateUrl();
  }

  updateOrder(event: SelectChangeEvent) {
    this.order = event.value.value === this.defaultParams.order ? undefined : event.value.value;
    this.updateUrl();
  }

  onCategorySelected(event: CheckboxChangeEvent, name: string) {
    if (event.checked) {
      this.categoryNames = [...this.categoryNames, name];
    } else {
      this.categoryNames = this.categoryNames.filter(c => c !== name);
    }
    this.updateUrl();
  }
}
