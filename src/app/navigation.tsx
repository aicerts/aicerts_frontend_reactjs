import { logout } from '@/common/auth';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef  } from 'react';
import {Navbar, Container, NavDropdown, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();
  const isUserLoggedIn = useRef(false); // Use useRef instead of a variable

  const handleViewProfile = () => {
    window.location.href = "/"
  } 
  
  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null; // Update the ref value
  }, []);

  const handleLogout = () => {
  
    localStorage.removeItem('user');
    
    router.push('/');
  };
  const routesWithLogoutButton = ['/certificates', '/issue-pdf-certificate', '/issue-certificate'];
  return (
    <>
      <Navbar className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <Container fluid>
          <Navbar.Brand href="/certificates">
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
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <NavDropdown 
                as={ButtonGroup}
                align={{ md: 'end' }}
                title={
                  <div className='picture'>
                    <span>jd</span>
                    <div className='dropdown-arrow'>
                      <Image 
                        src="https://images.netcomlearning.com/ai-certs/icons/down-arrow.svg"
                        layout='fill'
                        objectFit='contain'
                        alt='Dropdown Menu'
                      />
                    </div>
                  </div>
                  
                }
                className='profile'
               >
                <div className='user-info'>
                  <div className='divider'>
                    <div className='info'>
                        <span className='label'>Attribute #01</span>
                        <span className='data'>Value</span>
                    </div>
                    <div className='info'>
                        <span className='label'>Attribute #01</span>
                        <span className='data'>Value</span>
                    </div>
                  </div>
                  <div className='divider'>
                    <div className='info'>
                        <span className='label'>Attribute #01</span>
                        <span className='data'>Value</span>
                    </div>
                    <div className='info'>
                        <span className='label'>Attribute #01</span>
                        <span className='data'>Value</span>
                    </div>
                  </div>
                </div>
              </NavDropdown>
            </Navbar.Text>
            <Navbar.Text>
              {routesWithLogoutButton.includes(router.pathname) && (
                <div className='logout' onClick={handleLogout}>
                  <Image
                    src='https://images.netcomlearning.com/ai-certs/logout.svg'
                    layout='fill'
                    objectFit="contain"
                    alt='logout Icon'
                  />
                </div>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;