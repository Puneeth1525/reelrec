import React, { Fragment } from 'react';
import './nav.component.css';
import NavSearch from '../../components/nav-search/nav-search.component';
import { Outlet, Link } from 'react-router-dom';

const Nav = () => {
  return (
    <Fragment>
      <div className="nav">
        <ul className="ul">
          <li className="li">
            <Link className="a active" to="/">Browse</Link>
          </li>
          <li className="li">
            <Link className="a" to="/home">Home</Link>
          </li>
          <li className="li">
            <NavSearch width="350%" placeholder="Search for movies..." />
          </li>
        </ul>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Nav;
