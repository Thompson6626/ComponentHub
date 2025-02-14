import {inject, Injectable} from '@angular/core';
import {userConfig} from '../../../environments/user-config';
import {HttpClient} from '@angular/common/http';
import {UpdateUsernameRequest} from '../models/update-username-request';
import {SimpleResponse} from '../../../shared/models/simple-response';
import {UpdatePasswordRequest} from '../models/update-password-request';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {AuthStateService} from '../../../core/services/AuthState/auth-state.service';
import {UserDetails} from '../../../shared/models/user-details';
import {replaceUrlPlaceholders} from '../../../shared/utils/string-utils';
import {UserPublicDetails} from '../../../shared/models/user-public-details';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private GET_CURRENT_USER_DETAILS_URL = userConfig.currentUserDetails;
  private GET_USER_DETAILS_URL = userConfig.userDetails;

  private UPDATE_USERNAME_URL = userConfig.updateUsername;
  private UPDATE_PASSWORD_URL = userConfig.updatePassword;

  private http = inject(HttpClient);
  private authStateService = inject(AuthStateService);

  updateUsername(request: UpdateUsernameRequest): Observable<SimpleResponse> {
    return this.http.put<SimpleResponse>(this.UPDATE_USERNAME_URL, request).pipe(
      tap(() => {
          this.authStateService.setUserDetailsUsername(request.newUsername);
      }),
      catchError(error =>{
        console.log("Failed to update username ", error);
        return throwError(() => error);
      })
    );
  }

  updatePassword(request: UpdatePasswordRequest): Observable<SimpleResponse> {
    return this.http.put<SimpleResponse>(this.UPDATE_PASSWORD_URL, request);
  }

  getUserDetails(username: string): Observable<UserPublicDetails> {
    const modifiedUrl = replaceUrlPlaceholders(this.GET_USER_DETAILS_URL,{ username });
    return this.http.get<UserPublicDetails>(modifiedUrl);
  }

  fetchCurrentUserDetails(): void {
    this.http.get<UserDetails>(this.GET_CURRENT_USER_DETAILS_URL).subscribe({
      next: (user) => {
        this.authStateService.userDetails = user;
      },
      error: (error) => console.error("Failed to fetch user details:", error)
    });
  }

}
