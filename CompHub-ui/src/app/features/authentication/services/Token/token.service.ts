import {Injectable, OnInit} from '@angular/core';
import {TokenResponse} from '../../models/token-reponse';
import {TokenWrapper} from '../../models/token-wrapper';

@Injectable({
  providedIn: 'root'
})
export class TokenService{

  private accessToken = 'access_token';
  private accessTokenExpiration = 'access_token_expiration';
  private refreshTokenKey = 'refresh_token';
  private refreshTokenExpiration = 'refresh_token_expiration';

  saveTokens(response: TokenResponse): void {
    localStorage.setItem(this.accessToken, response.access_token);
    localStorage.setItem(this.accessTokenExpiration, response.access_token_expires_at?.replace(" ","T"));
    localStorage.setItem(this.refreshTokenKey, response.refresh_token);
    if (response.refresh_token_expires_at){
      localStorage.setItem(this.refreshTokenExpiration, response.refresh_token_expires_at.replace(" ","T"));
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAccessTokenExpired(): boolean {
    const access = this.getAccessToken();
    if (!access) {
      return true;
    }
    const accessExpiration = localStorage.getItem(this.accessTokenExpiration);
    if (!accessExpiration) {
      return true;
    }

    return Date.now() >= new Date(accessExpiration).getTime();
  }

  isRefreshTokenExpired(): boolean {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      return true;
    }
    const refreshExpiration = localStorage.getItem(this.refreshTokenExpiration);
    if (!refreshExpiration) {
      return true;
    }
    return Date.now() >= new Date(refreshExpiration).getTime();
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.accessTokenExpiration);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.refreshTokenExpiration);
  }
}
