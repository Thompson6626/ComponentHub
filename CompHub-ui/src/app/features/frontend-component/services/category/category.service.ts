import {inject, Injectable} from '@angular/core';
import {categoryConfig} from '../../../../environments/category-config';
import {CategoryResponse} from '../../models/category/category-response';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CategoryCreateRequest} from '../../models/category/category-create-request';
import { replaceUrlPlaceholders } from '../../../../shared/utils/string-utils';
import {CategoryUpdateRequest} from '../../models/category/category-update-request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private GET_ALL_URL = categoryConfig.getAll;
  private CREATE_URL = categoryConfig.create;
  private UPDATE_URL = categoryConfig.update;
  private DELETE_URL = categoryConfig.delete;

  private http = inject(HttpClient);

  getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.GET_ALL_URL);
  }

  create(request: CategoryCreateRequest){
    return this.http.post<CategoryResponse>(this.CREATE_URL, request);
  }

  update(request: CategoryUpdateRequest){
    return this.http.post<CategoryResponse>(this.UPDATE_URL, request);
  }

  delete(id: number) {
    const modifiedUrl = replaceUrlPlaceholders(this.DELETE_URL, { categoryId : id.toString()});
    return this.http.delete<void>(modifiedUrl);
  }
}
