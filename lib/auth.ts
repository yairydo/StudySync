import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Email/Password auth
export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Google sign-in
const GOOGLE_WEB_CLIENT_ID = '791614950917-105hripd9o12s5ut3s4d4m9o8k32j19l.apps.googleusercontent.com';

// Web-specific: Use Firebase's signInWithPopup
export async function signInWithGoogleWeb() {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  return signInWithPopup(auth, provider);
}

// Mobile-specific: Use Expo AuthSession
export function useGoogleAuth() {
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',
      usePKCE: true,
      prompt: AuthSession.Prompt.SelectAccount,
    },
    discovery
  );
  return { request, response, promptAsync, discovery, redirectUri };
}

export async function exchangeGoogleCode(
  code: string,
  codeVerifier: string,
  redirectUri: string,
  discovery: AuthSession.DiscoveryDocument
) {
  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      code,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    discovery
  );
  if (tokenResult.idToken) {
    const credential = GoogleAuthProvider.credential(tokenResult.idToken);
    return signInWithCredential(auth, credential);
  }
  throw new Error('No id_token received from Google');
}

// Microsoft sign-in
const MICROSOFT_CLIENT_ID = 'YOUR_MICROSOFT_CLIENT_ID';
const MICROSOFT_TENANT_ID = 'common';

const microsoftDiscoveryDoc = {
  authorizationEndpoint: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
};

export function useMicrosoftAuth() {
  const redirectUri = AuthSession.makeRedirectUri();
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: MICROSOFT_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    microsoftDiscoveryDoc
  );
  return { request, response, promptAsync };
}

export async function signInWithMicrosoft(accessToken: string) {
  const provider = new OAuthProvider('microsoft.com');
  const credential = provider.credential({ accessToken });
  return signInWithCredential(auth, credential);
}

export async function signOut() {
  return firebaseSignOut(auth);
}
