import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import {Navbar} from 'react-bootstrap';
import Button from '../../shared/button/button';

const NavigationLogin = () => {
  const handleClick = () => {
    window.location.href = '/register';
  };

  useEffect(() => {

    // Remove user from localStorage
    localStorage.removeItem('user');
  }, []);

  return (  
    <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className='nav-logo'>
          <Link className="navbar-brand" href="/">
            <Image
              src='/logo.svg'
              layout='fill'
              objectFit="contain"
              alt='AI Certs logo'
            />
          </Link>
        </div>
        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <span className='nav-text text-decoration-none'>Dont have an account?</span>
            </Navbar.Text>
            <Navbar.Text>
              <Button label="Apply for Account" onClick={handleClick} className="golden" />
            </Navbar.Text>
          </Navbar.Collapse>
        </div>
      </div>
    </nav>
  );
};

export default NavigationLogin;