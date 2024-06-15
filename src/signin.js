import { signInWithPopup, getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from './firebase-config';

const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
};

const signInWithMicrosoft = async () => {
  try {
    await signInWithPopup(auth, microsoftProvider);
    console.log('User signed in with Microsoft');
  } catch (error) {
    console.error('Error signing in with Microsoft', error);
  }
};

// This function will be called when the authentication state changes
const handleAuthStateChanged = async (user) => {
  if (user) {
    console.log('User signed in with Google:', user.email, user.uid);

    // Make a POST request to your API with user data
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

// Listen for authentication state changes
onAuthStateChanged(auth, handleAuthStateChanged);

export { signInWithGoogle, signInWithMicrosoft };
