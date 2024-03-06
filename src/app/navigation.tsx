import { logout } from '@/common/auth';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState  } from 'react';
import {Navbar, Container, NavDropdown, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;
import {getAuth} from "firebase/auth"
const Navigation = () => {
  const router = useRouter();
  const auth = getAuth()
  const isUserLoggedIn = useRef(false); // Use useRef instead of a variable
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    certificateIssued:""
  });
  const handleViewProfile = () => {
    window.location.href = "/user-details"
  } 
  
  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null; // Update the ref value
  }, []);

  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const userDetails = JSON.parse(localStorage?.getItem('user'));

    if (userDetails && userDetails.JWTToken) {
      // If token is available, set it in the state
      setFormData({
        organization: userDetails?.organization || "-",
        name: userDetails?.name || "-",
        certificateIssued: userDetails?.certificateIssued || "-"
      });
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
  }, []);


  const handleLogout = () => {
  
    localStorage.removeItem('user');
    auth.signOut().then(()=>{
      console.log("signout Successfully")
    })
    
    router.push('/');
  };
  const routesWithLogoutButton = ['/certificates', '/issue-pdf-certificate', '/issue-certificate', "/user-details"];
  return (
    <>
      <Navbar className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <Container fluid>
          <Navbar.Brand>
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
                    <span>
  {formData?.name?.split(' ')?.slice(0, 2)?.map(word => word[0])?.join('')}
</span>

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
                    <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/profile-dark.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>Issuer Name</span>
                          <span className='data'>{formData?.name|| ""}</span>
                        </div>
                    </div>
                    <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/organization.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>Organization Name</span>
                          <span className='data'>{formData?.organization|| ""}</span>
                        </div>
                    </div>
                    <div className='info d-flex align-items-center'>
                        <div className='icon'>
                          <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/certificate-issued.svg"
                            width={18}
                            height={18}
                            alt='Profile'
                          />
                        </div>
                        <div>
                          <span className='label'>No. of Certificates Issued</span>
                          <span className='data'>{formData?.certificateIssued|| ""}</span>
                        </div>
                    </div>
                  </div>
                  <Button label="View &#8594;" className='golden py-2 ps-0 pe-0 w-100 mt-4' onClick={handleViewProfile} />
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