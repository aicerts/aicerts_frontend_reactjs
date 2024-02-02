import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {Navbar} from 'react-bootstrap';
import Button from '../../shared/button/button';

const AdminNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Perform logout logic
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    window.location.href = '/admin/';
  };

  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className='nav-logo'>
            <Link className="navbar-brand" href="/">
              <Image
                src='/logo-black.svg'
                layout='fill'
                objectFit="contain"
                alt='AI Certs logo'
              />
            </Link>
          </div>
          {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <Navbar.Text>
                <Button label="Logout" onClick={handleLogout} className="golden" />
              </Navbar.Text>
            ) : (
              <Navbar.Text>
                <Button label="Login" onClick={handleLogin} className="golden" />
              </Navbar.Text>
            )}
          </Navbar.Collapse>
        </div> */}
        </div>
      </nav>
    </>
  );
};

export default AdminNavigation;