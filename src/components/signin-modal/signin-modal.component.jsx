import React from 'react';
import { auth, googleProvider } from '../../firebase-config';
import './signin-modal.component.css';

const SignInModal = ({ showModal, closeModal }) => {
  const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then(() => closeModal());
  };

//   const signInWithMicrosoft = () => {
//     auth.signInWithPopup(microsoftProvider).then(() => closeModal());
//   };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`} onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Sign In</h2>
        <button onClick={signInWithGoogle}>Sign In with Google</button>
        {/* <button onClick={signInWithMicrosoft}>Sign In with Microsoft</button> */}
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default SignInModal;
