import { ENV } from './../core/env.config';

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
  NAMESPACE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '27mJNdjcNkl662VfOwcpjzx79pdVpTum',
  CLIENT_DOMAIN: 'biol.auth0.com', // e.g., kmaida.auth0.com
  AUDIENCE: 'https://biol.auth0.com/api/v2/', // e.g., http://localhost:8083/api/
  REDIRECT: `${ENV.BASE_URI}/callback`,
  SCOPE: '',
  NAMESPACE: 'http://myapp.com/roles'
};
