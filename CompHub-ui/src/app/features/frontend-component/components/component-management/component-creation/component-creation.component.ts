import {Component, inject, OnInit} from '@angular/core';
import {debounceTime, first} from 'rxjs';
import {ComponentService} from '../../../services/ui-component/component.service';
import {AuthStateService} from '../../../../../core/services/AuthState/auth-state.service';
import {CategoryService} from '../../../services/category/category.service';
import {CategoryResponse} from '../../../models/category/category-response';
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../core/services/Toast/toast.service';
import {Button} from 'primeng/button';
import {UniqueComponentNameValidator} from '../../../validators/unique-component-name';

interface CreateComponentForm{
  name: FormControl<string>;
  description: FormControl<string>;
  categories: FormControl<CategoryResponse[]>;
}

@Component({
  selector: 'app-component-creation',
  imports: [
    MultiSelect,
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './component-creation.component.html',
  styleUrl: './component-creation.component.sass'
})
export class ComponentCreationComponent implements OnInit {

  categoriesArr! : CategoryResponse[];

  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  private uniqueComponentNameValidator = inject(UniqueComponentNameValidator);

  form = this.fb.group<CreateComponentForm>({
    name: this.fb.control(
      '',
      Validators.required,
      this.uniqueComponentNameValidator.validate.bind(this.uniqueComponentNameValidator)
    ),
    description: this.fb.control(''),
    categories: this.fb.control([])
  },{ updateOn:"blur" });

  private componentService = inject(ComponentService);
  private authStateService = inject(AuthStateService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.categoryService.getAll()
      .pipe(first())
      .subscribe({
        next:(categories) => this.categoriesArr = categories,
        error: err => this.categoriesArr = []
      });
  }



  onSubmit(){

    const { name, description, categories } = this.form.value;

    if (!name){
      return;
    }

    let categoryIds =  categories?.map((category) => category.id) || [];

    this.componentService.create({name , description : description ?? '' , categoryIds}).subscribe({
      next: value => {
        const username = this.authStateService.getCurrentUserDetails()!.username;
        this.router.navigate([`/user/${username}/component/${name}`],{relativeTo: this.activeRoute});
      },
      error: err => {
        this.toastService.showErrorToast("Error creating component", err.message);
        console.error(err)

      }
    });



  }









}
