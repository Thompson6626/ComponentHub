import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {TokenResponse} from '../models/token-reponse.js';
import { RegistrationRequest } from '../models/registration-request';
import {LoginRequest} from '../models/login-request';
import {SimpleResponse} from '../models/simple-response';
import {authConfig} from '../../../environments/auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private REGISTER_URL = authConfig.register;
  private LOGIN_URL = authConfig.login;
  private REFRESH_URL = authConfig.refresh;
  private VERIFY_EMAIL_URL = authConfig.emailVerification;
  private RESEND_VERIFICATION_URL = authConfig.resendVerification;

  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  register(request: RegistrationRequest): Observable<SimpleResponse> {
    return this.httpClient.post<SimpleResponse>(this.REGISTER_URL,request);
  }

  logIn(request: LoginRequest): Observable<TokenResponse>{
    return this.httpClient.post<TokenResponse>(this.LOGIN_URL, request)
      .pipe(
        tap((response: TokenResponse) => {
          if(response){
            this.saveTokens(response);
          }
        })
    )
  }
  refreshToken(): Observable<TokenResponse>{
    const refreshToken  = this.getRefreshToken()

    if (!refreshToken){
      this.logOut();
      return throwError(() => new Error('No refresh token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);

    return this.httpClient.post<TokenResponse>(this.REFRESH_URL, null, {headers} ).pipe(
      tap(response => {
        if(response){
          this.saveTokens(response);
        }
      }),
      catchError(error => {
        this.logOut();
        return throwError(() => error);
      })
    )
  }

  verifyEmail(token: string): Observable<SimpleResponse> {
    const params = new HttpParams().set('token', token);
    return this.httpClient.get<SimpleResponse>(this.VERIFY_EMAIL_URL, { params });
  }

  resendVerificationEmail(email: string): Observable<SimpleResponse> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<SimpleResponse>(this.RESEND_VERIFICATION_URL, { params });
  }

  private saveTokens(response: TokenResponse): void {
    localStorage.setItem(this.tokenKey, response.access_token);
    localStorage.setItem(this.refreshTokenKey, response.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(){
    return !localStorage.getItem(this.tokenKey);
  }

  logOut(): void{
    this.clearTokens()
    this.router.navigate(['/components']);
  }
}
