import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.webp';
import './header.styles.css';

import { connect } from 'react-redux';

import { auth } from '../../firebase/firebase.utils';

const Header = ({ currentUser }) => (
  <header className='nav flex my-4 mx-6 justify-between'>
    <Link className='logo-link flex' to='/aloe-you'>
      <img src={logo} alt='Logo of a green monstera leaf' className='logo' />
      <h2 className='company-name flex items-end ml-2'>Aloe You</h2>
    </Link>
    <nav className='nav-links items-end hidden md:flex space-x-11'>
      <Link to='/aloe-you/shop' className='hover:text-teal-400'>
        Shop
      </Link>
      <Link to='/aloe-you/shop' className='hover:text-teal-400'>
        About
      </Link>
      <Link to='/aloe-you/shop' className='hover:text-teal-400'>
        Care
      </Link>
      <Link to='/aloe-you/shop' className='hover:text-teal-400'>
        Contact
      </Link>
    </nav>
    <div className='utils flex'>
      <div className='bag flex items-end hover:scale-125 cursor-pointer'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='#56555A'
        >
          <path d='M6.665 9.068l-3.665-1.66v14l3.665 2.592 14.335-2.155v-14.845l-14.335 2.068zm-1.665 1.441l1 .453v10.118l-1-.707v-9.864zm14 9.615l-11 1.653v-10.881l11-1.587v10.815zm-2-15.833l-.001 1.749c0 .246-.18.455-.423.492-.303.045-.576-.19-.576-.495v-1.746c.001-.691-.231-1.304-.653-1.726-.368-.37-.847-.565-1.384-.565-1.547 0-2.96 1.558-2.963 3.268v1.681c0 .247-.181.457-.425.494-.302.046-.575-.189-.575-.494l.001-1.683c.004-2.261 1.866-4.266 3.962-4.266 1.717 0 3.039 1.387 3.037 3.291zm-9.999 2.209v-2.235c.004-2.26 1.866-4.265 3.962-4.265.492 0 .944.125 1.35.332-.423.17-.822.4-1.188.683l-.162-.015c-1.547 0-2.961 1.558-2.963 3.268v2.232c0 .248-.182.458-.427.494-.3.045-.572-.187-.572-.494z' />
        </svg>
      </div>
      {currentUser ? (
        <div
          className='login flex items-end ml-4 hover:text-teal-400 text-m cursor-pointer'
          onClick={() => auth.signOut()}
        >
          Logout
        </div>
      ) : (
        <Link
          to='aloe-you/login '
          className='login flex items-end ml-4 hover:text-teal-400 text-m cursor-pointer'
        >
          Login
        </Link>
      )}
    </div>
  </header>
);

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Header);
