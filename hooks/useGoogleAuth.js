import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/config';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '974753081458-0ukdr7q2ljh2gf0cmavm7m57jd2tb2rh.apps.googleusercontent.com';

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
console.log('Redirect URI (proxy):', redirectUri);

export default function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.log('Google sign-in error:', error.message);
      });
    } else if (response?.type === 'error') {
      console.log('Google auth error:', response.error);
    }
  }, [response]);

  return { request, promptAsync: () => promptAsync({ useProxy: true }) };
}
