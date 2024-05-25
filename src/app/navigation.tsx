import { logout } from '@/common/auth';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Container, NavDropdown, ButtonGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Button from '../../shared/button/button';
import { jwtDecode } from 'jwt-decode';
import { getAuth } from 'firebase/auth';

const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL_admin;
const imageUrl = 'https://images.netcomlearning.com/ai-certs';
const imageSource = `${imageUrl}/Certs365-logo.svg`;

const Navigation = () => {
  const router = useRouter();
  const auth = getAuth();
  const isUserLoggedIn = useRef(false);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    certificatesIssued: '',
  });

  const handleViewProfile = () => {
    window.location.href = '/user-details';
  };

  useEffect(() => {
    isUserLoggedIn.current = localStorage?.getItem('user') !== null;
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? '');

    if (storedUser && storedUser.JWTToken) {
      setToken(storedUser.JWTToken);
      fetchData(storedUser.email);
      setFormData({
        organization: storedUser.organization || '',
        name: storedUser.name || '',
        certificatesIssued: storedUser.certificatesIssued || '',
      });
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchData = async (email: any) => {
    const data = { email };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-issuer-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const userData = await response.json();
      const userDetails = userData?.data;
      setFormData({
        organization: userDetails?.organization || '-',
        name: userDetails?.name || '-',
        certificatesIssued: userDetails?.certificatesIssued || '-',
      });
    } catch (error) {
      console.error('Error ', error);
    }
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage?.getItem('user') ?? '');

    if (userDetails && userDetails.JWTToken) {
      fetchData(userDetails.email);
      setLogoutTimer(userDetails.JWTToken);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('badgeUrl');
    sessionStorage.removeItem('logoUrl');
    sessionStorage.removeItem('signatureUrl');
    sessionStorage.removeItem('issuerName');
    sessionStorage.removeItem('issuerDesignation');
    sessionStorage.removeItem('certificatesList');

    auth.signOut().then(() => {
      console.log('signout Successfully');
    });

    router.push('/');
  };

  const setLogoutTimer = (token: string) => {
    interface DecodedToken {
      exp: number;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    console.log(decodedToken.exp)
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeout = expirationTime - currentTime;
    console.log(timeout)

    if (timeout > 0) {
      setTimeout(handleLogout, timeout);
    } else {
      handleLogout();
    }
  };

  const routesWithLogoutButton = [
    '/certificates',
    '/issue-pdf-certificate',
    '/issue-certificate',
    '/certificate',
    '/certificate/[id]',
    '/certificate/download',
    '/dashboard',
    '/user-details',
  ];

  return (
    <>
      <Navbar className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <Container fluid>
          <Navbar.Brand>
            <div className="nav-logo">
              <Link className="navbar-brand" href="/certificates">
                <Image src={imageSource} layout="fill" objectFit="contain" alt="AI Certs logo" />
              </Link>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {routesWithLogoutButton.includes(router.pathname) && (
              <Navbar.Text>
                <NavDropdown
                  as={ButtonGroup}
                  align={{ md: 'end' }}
                  title={
                    <div className="picture">
                      <span>
                        {formData?.name?.split(' ')?.slice(0, 2)?.map((word) => word[0])?.join('')}
                      </span>
                      <div className="dropdown-arrow">
                        <Image
                          src="https://images.netcomlearning.com/ai-certs/icons/down-arrow.svg"
                          layout="fill"
                          objectFit="contain"
                          alt="Dropdown Menu"
                        />
                      </div>
                    </div>
                  }
                  className="profile"
                >
                  <div className="user-info">
                    <div className="divider">
                      <div className="info d-flex align-items-center">
                        <div className="icon">
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/profile-dark.svg"
                            width={18}
                            height={18}
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <span className="label">Issuer Name</span>
                          <span className="data">{formData?.name || ''}</span>
                        </div>
                      </div>
                      <div className="info d-flex align-items-center">
                        <div className="icon">
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/organization.svg"
                            width={18}
                            height={18}
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <span className="label">Organization Name</span>
                          <span className="data">{formData?.organization || ''}</span>
                        </div>
                      </div>
                      <div className="info d-flex align-items-center">
                        <div className="icon">
                          <Image
                            src="https://images.netcomlearning.com/ai-certs/icons/certificate-issued.svg"
                            width={18}
                            height={18}
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <span className="label">No. of Certification Issued</span>
                          <span className="data">{formData?.certificatesIssued || ''}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      label="View &#8594;"
                      className="golden py-2 ps-0 pe-0 w-100 mt-4"
                      onClick={handleViewProfile}
                    />
                  </div>
                </NavDropdown>
              </Navbar.Text>
            )}
            <Navbar.Text>
              {routesWithLogoutButton.includes(router.pathname) && (
                <div className="logout" onClick={handleLogout}>
                  <Image
                    src="https://images.netcomlearning.com/ai-certs/logout.svg"
                    layout="fill"
                    objectFit="contain"
                    alt="logout Icon"
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
