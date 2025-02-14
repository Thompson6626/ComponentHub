import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {inject, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TokenResponse} from '../../models/token-reponse';
import { RegistrationRequest } from '../../models/registration-request';
import {LoginRequest} from '../../models/login-request';
import {SimpleResponse} from '../../../../shared/models/simple-response';
import {authConfig} from '../../../../environments/auth-config';
import {AuthStateService} from '../../../../core/services/AuthState/auth-state.service';
import {TokenService} from '../Token/token.service';
import {ResendVerificationRequest} from '../../models/resend-verification-request';
import {UserService} from '../../../user/services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private REGISTER_URL = authConfig.register;
  private LOGIN_URL = authConfig.login;
  private REFRESH_URL = authConfig.refresh;
  private VERIFY_EMAIL_URL = authConfig.emailVerification;
  private RESEND_VERIFICATION_URL = authConfig.resendVerification;
  private LOGOUT_URL = authConfig.logout;

  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private authStateService = inject(AuthStateService);
  private userService = inject(UserService);


  ngOnInit(): void {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isAccessTokenExpired()){
      this.authStateService.isAuthenticated = true;
      if (this.authStateService.getCurrentUserDetails() !== null){
        this.userService.fetchCurrentUserDetails();
      }
    }else {
      this.logout();
    }
  }

  register(request: RegistrationRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(this.REGISTER_URL,request);
  }

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.LOGIN_URL, request).pipe(
      tap((response: TokenResponse) => {
        if (response) {
          this.authStateService.isAuthenticated = true;
          this.tokenService.saveTokens(response);
          this.userService.fetchCurrentUserDetails();
        }
      }),
      catchError((error) => {
        console.log(error)
        this.authStateService.isAuthenticated = false;
        return throwError(() => new Error('Login failed'));
      })
    );
  }


  refreshToken(): Observable<TokenResponse>{
    const refresh  = this.tokenService.getRefreshToken();

    if (!refresh){
      this.logout();
      return throwError(() => new Error('No refresh token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refresh}`);

    return this.http.post<TokenResponse>(this.REFRESH_URL, null, {headers} ).pipe(
      tap(response => {
        if(response){
          this.tokenService.saveTokens(response);
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    )
  }

  logout(redirect: boolean = false): void {
    this.authStateService.isAuthenticated = false;
    this.authStateService.userDetails = null;

    const accessToken = this.tokenService.getAccessToken();
    this.tokenService.clearTokens();

    if (accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      this.http.post(this.LOGOUT_URL, {}, { headers }).subscribe({
        next: async () => {
          if (redirect){
            await this.router.navigate(['/auth/login']);
          }
        },
        error: (httpError: any) => {
          console.error('Logout failed:', httpError);
        }
      });
    }
  }

  verifyEmail(verificationToken: string): Observable<SimpleResponse> {
    const params = new HttpParams().set('token', verificationToken);
    return this.http.post<SimpleResponse>(this.VERIFY_EMAIL_URL, {} ,{ params });
  }

  resendVerificationEmail(request: ResendVerificationRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(this.RESEND_VERIFICATION_URL, request);
  }

}
