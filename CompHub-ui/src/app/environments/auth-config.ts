import {environment} from './environment';

const authUrl = `${environment.apiUrl}/auth`;

export const authConfig = {
  register: `${authUrl}/register`,
  login: `${authUrl}/login`,
  refresh: `${authUrl}/refresh`,
  emailVerification: `${authUrl}/verify-email`,
  resendVerification: `${authUrl}/resend-verification`,
  logout: `${authUrl}/logout`,
};
