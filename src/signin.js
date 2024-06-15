import {
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from './firebase-config';

let isSigningIn = false; // Add this flag

const signInWithGoogle = async () => {
  if (isSigningIn) return; // Prevent multiple sign-in attempts
  try {
    isSigningIn = true;
    const googleProvider = new GoogleAuthProvider();
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google', error);
  } finally {
    isSigningIn = false;
  }
};

const signInWithMicrosoft = async () => {
  if (isSigningIn) return; // Prevent multiple sign-in attempts
  try {
    isSigningIn = true;
    await signInWithPopup(auth, microsoftProvider);
    console.log('User signed in with Microsoft');
  } catch (error) {
    console.error('Error signing in with Microsoft', error);
  } finally {
    isSigningIn = false;
  }
};

const handleAuthStateChanged = async (user) => {
  if (user) {
    console.log('User signed in:', user.email, user.uid);

    const apiUrl = 'http://18.190.29.212:3000/users';
    const requestBody = {
      email: user.email,
      uid: user.uid
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to send user data to API');
      }

      console.log('User data sent to API successfully');
    } catch (error) {
      console.error('Error sending user data to API', error);
    }
  }
};

// Handle the result of the redirect
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result.user) {
      handleAuthStateChanged(result.user);
    }
  } catch (error) {
    console.error('Error handling redirect result', error);
  }
};

// Call handleRedirectResult when the script is loaded
handleRedirectResult();

onAuthStateChanged(auth, handleAuthStateChanged);

export { signInWithGoogle, signInWithMicrosoft };
