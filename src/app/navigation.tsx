import { logout } from '@/common/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef  } from 'react';
import {Navbar, Button} from 'react-bootstrap';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();
  const isUserLoggedIn = useRef(false); // Use useRef instead of a variable
  
  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null; // Update the ref value
  }, []);

  const handleLogout = () => {
  
    localStorage.removeItem('user');
    
    router.push('/');
  };
  const routesWithLogoutButton = ['/certificates', '/issue-pdf-certificate', '/issue-certificate', '/certificate', '/certificate/[id]', '/certificate/download', '/certificate/asd' ];
  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className='d-flex justify-content-between align-items-center w-100'>
          <div className='nav-logo'>
            <Link className="navbar-brand" href="/certificates">
              <Image
                src='https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
                layout='fill'
                objectFit="contain"
                alt='AI Certs logo'
              />
            </Link>
          </div>
          {routesWithLogoutButton.includes(router.pathname) && (
              <div className='nav-logo logout'>
                <button className="btn btn-link" onClick={handleLogout}>
                  <Image
                    src='https://images.netcomlearning.com/ai-certs/logout.svg'
                    layout='fill'
                    objectFit="contain"
                    alt='logout Icon'
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;