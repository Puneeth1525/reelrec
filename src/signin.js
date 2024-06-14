import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from './firebase-config';

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    console.log('User signed in with Google');
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

export { signInWithGoogle, signInWithMicrosoft };
