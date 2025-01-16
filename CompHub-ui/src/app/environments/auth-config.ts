import {environment} from './environment';

interface AuthConfig {
  register: string;
  login: string;
  refresh: string;
  emailVerification: string;
  resendVerification: string;
}

const authUrl = "auth";

export const authConfig: AuthConfig = {
  register: `${environment.apiUrl}/${authUrl}/register`,
  login: `${environment.apiUrl}/${authUrl}/login`,
  refresh: `${environment.apiUrl}/${authUrl}/refresh`,
  emailVerification: `${environment.apiUrl}/${authUrl}/verify-email`,
  resendVerification: `${environment.apiUrl}/${authUrl}/resend-verification`
};
