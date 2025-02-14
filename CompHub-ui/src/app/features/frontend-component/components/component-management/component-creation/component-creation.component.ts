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


interface CreateComponentForm{
  name: FormControl<string>;
  description: FormControl<string>;
  categories: FormControl<CategoryResponse[]>;
}


@Component({
  selector: 'app-component-creation',
  imports: [
    MultiSelect,
    ReactiveFormsModule
  ],
  templateUrl: './component-creation.component.html',
  styleUrl: './component-creation.component.sass'
})
export class ComponentCreationComponent implements OnInit {

  userComponentNames! : Set<string>;
  categoriesArr! : CategoryResponse[];

  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  form = this.fb.group<CreateComponentForm>({
    name: this.fb.control('', Validators.required),
    description: this.fb.control(''),
    categories: this.fb.control([])
  });


  private componentService = inject(ComponentService);
  private authStateService = inject(AuthStateService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    const currentUser = this.authStateService.getCurrentUserDetails();

    this.componentService.getUserCompNames(currentUser!.id)
      .pipe(first())
      .subscribe({
        next:(compNames) => this.userComponentNames = new Set(compNames),
        error: err => this.userComponentNames = new Set()
      });

    this.categoryService.getAll()
      .pipe(first())
      .subscribe({
        next:(categories) => this.categoriesArr = categories,
        error: err => this.categoriesArr = []
      });

    this.form.get("name")?.valueChanges.
      pipe(
      debounceTime(500)
    ).subscribe( name =>{
        if (this.userComponentNames?.has(name)) {
          this.form.get("name")?.setErrors({ NameAlreadyInUse: true })
        }
      }
    );

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
      }
    });



  }









}
