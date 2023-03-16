

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (

      <nav className="nav-bar">
        <div className="home">
        <NavLink exact to="/">Yeetup</NavLink>
        </div>
        <div className="container">
        <div className="profile">
          {isLoaded && (<ProfileButton user={sessionUser} />)}
          </div>
        </div>

    </nav>

  );
}

export default Navigation;
