import {inject, Injectable} from '@angular/core';
import {componentConfig} from '../../../../environments/ui-component.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ComponentShowcase} from '../../models/component/component-showcase';
import { Observable} from 'rxjs';
import {ComponentRequest} from '../../models/component/component-request';
import {ComponentResponse} from '../../models/component/component-response';
import { replaceUrlPlaceholders } from '../../../../shared/utils/string-utils';
import {PageResponse} from '../../../../shared/models/page-response';
import {VoteRequest} from '../../models/vote/vote-request';


interface BackendQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: string;
  categoryNames?: string[];
}


@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  private GET_BY_SEARCH = componentConfig.search;
  private GET_ALL = componentConfig.getAll;
  private GET_BY_ID = componentConfig.getById;
  private GET_BY_USERNAME = componentConfig.getByUsername;
  private GET_USER_COMP_NAMES = componentConfig.userComponentNames;
  private GET_BY_USERNAME_AND_COMP_NAME = componentConfig.getByUsernameAndCompName;

  private CREATE = componentConfig.create;
  private VOTE = componentConfig.vote;

  private UPDATE = componentConfig.update;

  private DELETE_BY_ID = componentConfig.delete;

  private http = inject(HttpClient);


  create(request: ComponentRequest): Observable<ComponentResponse> {
    return this.http.post<ComponentResponse>(this.CREATE, request);
  }

  getById(id: number): Observable<ComponentResponse> {
    const modifiedUrl = replaceUrlPlaceholders(this.GET_BY_ID,{componentId : id.toString()});

    return this.http.get<ComponentResponse>(modifiedUrl);
  }

  getByUsername(
    username: string,
    querySearch: string,
    queryParams: BackendQueryParams
  ): Observable<PageResponse<ComponentResponse>> {
    const modifiedUrl = replaceUrlPlaceholders(this.GET_BY_USERNAME,{ username : username });

    let params = new HttpParams()
      .set('q',querySearch);

    params = this.setValidParams(params, queryParams);

    return this.http.get<PageResponse<ComponentResponse>>(modifiedUrl,{params});
  }

  update(id: number, request: ComponentRequest): Observable<ComponentResponse>  {
    const modifiedUrl = replaceUrlPlaceholders(this.UPDATE,{ componentId : id.toString() });
    return this.http.put<ComponentResponse>(modifiedUrl, request);
  }

  getUserCompNames(userId: number): Observable<string[]>{
    const modifiedUrl = replaceUrlPlaceholders(this.GET_USER_COMP_NAMES,{userId:userId.toString()});
    return this.http.get<string[]>(modifiedUrl);
  }

  getByUsernameAndCompName(
    username:string,
    compName: string
  ): Observable<ComponentResponse>  {
    const modifiedUrl = replaceUrlPlaceholders(this.GET_BY_USERNAME_AND_COMP_NAME,{username:username, componentName:compName});

    return this.http.get<ComponentResponse>(modifiedUrl);
  }

  search(
    querySearch: string, queryParams: BackendQueryParams
  ): Observable<PageResponse<ComponentShowcase>> {
    const qs = querySearch?.trim() ?? '';
    if (!qs.length) {
      return this.getAll(queryParams);
    }

    let params = new HttpParams()
      .set('q', querySearch);

    params = this.setValidParams(params,queryParams);

    return this.http.get<PageResponse<ComponentShowcase>>(this.GET_BY_SEARCH, { params });
  }

  getAll(queryParams: BackendQueryParams): Observable<PageResponse<ComponentShowcase>> {
    let params = new HttpParams();

    params = this.setValidParams(params,queryParams);

    return this.http.get<PageResponse<ComponentShowcase>>(this.GET_ALL, { params });
  }


  delete(id: number): Observable<void> {
    const modifiedUrl = replaceUrlPlaceholders(this.DELETE_BY_ID,{componentId : id.toString()});
    return this.http.delete<void>(modifiedUrl);
  }

  vote(componentId: number, request: VoteRequest): Observable<void>{
    const modifiedUrl = replaceUrlPlaceholders(this.VOTE,{ componentId: componentId.toString() });
    return this.http.post<void>(modifiedUrl,request);
  }

  private setValidParams(params: HttpParams, queryParams: BackendQueryParams): HttpParams {

    const { page, size, sortBy, order, categoryNames } = queryParams;

    if (page) params = params.set('page', page.toString());
    if (size) params = params.set('size', size.toString());
    if (sortBy?.trim()) params = params.set('sortBy', sortBy);
    if (order) params = params.set('order', order);
    if (categoryNames?.length) {
      categoryNames.forEach(c => params = params.append('categories', c));
    }

    return params;
  }





}
