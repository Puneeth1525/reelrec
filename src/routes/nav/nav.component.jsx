import React, { Fragment, useContext } from 'react';
import './nav.component.css';
import NavSearch from '../../components/nav-search/nav-search.component';
import { Outlet, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';
import { signOutUser } from '../../firebase-config';

const Nav = () => {
  const {currentUser} = useContext(UserContext);

  const signOutHandler = async () => {
    const res = await signOutUser();
    console.log(res)
  }

  return (
    <Fragment>
      <div className="nav">
        <ul className="ul">
          <li className="li nav-options">
            <Link className="a active" to="/">Browse</Link>
          </li>
          <li className="li search-bar">
            <NavSearch width="100%" placeholder="Search for movies..." />
          </li>
          {
            currentUser ? (
              <li>
            <span className='li nav-options' onClick={signOutHandler}>Sign out</span>
          </li>
            ) : (
              <span className='li nav-options'>Sign In</span>
            )
          }
        </ul>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Nav;
