import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  private searchQuerySubject = new BehaviorSubject<string>('');


  set searchQuery(newQuery: string) {
    this.searchQuerySubject.next(newQuery);
  }

  get searchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }

}
