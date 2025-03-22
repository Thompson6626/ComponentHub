import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserDetails} from '../../../shared/models/user-details';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userDetailsSubject = new BehaviorSubject<UserDetails | null>(null);


  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  set isAuthenticated(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }

  get userDetails$(): Observable<UserDetails | null>{
    return this.userDetailsSubject.asObservable();
  }

  setUserDetailsUsername(username: string): void {
    const currentDetails = this.userDetailsSubject.getValue();
    if (currentDetails && currentDetails.username !== username) {
      this.userDetailsSubject.next({ ...currentDetails, username });
    }
  }

  set userDetails(user: UserDetails | null) {
    this.userDetailsSubject.next(user);
  }

  getCurrentUserDetails(): UserDetails | null {
    return this.userDetailsSubject.getValue();
  }


}
