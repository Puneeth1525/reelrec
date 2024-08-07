import { firebase, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh5Dxw4UHOKCE71uFRic8YUVyjB0jAg7Q",
  authDomain: "reelrec.firebaseapp.com",
  projectId: "reelrec",
  storageBucket: "reelrec.appspot.com",
  messagingSenderId: "214205834949",
  appId: "1:214205834949:web:4b6f380e546c3f7f9e72ac",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

const microsoftProvider = new OAuthProvider("microsoft.com");
// export const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
export { auth, googleProvider, microsoftProvider };
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);
export const signOutUser = async () => await signOut(auth);
