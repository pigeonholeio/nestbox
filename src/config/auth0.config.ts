export const auth0Config = {
  domain: 'pigeonholeio.uk.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    audience: 'pigeonhole-toad',
    scope: 'openid profile email offline_access',
  },
};
