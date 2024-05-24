import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import GalleryCertificates from './gallery-certificates';

const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;

const BatchDates = ({ dates }) => {
  const [certificatesData, setCertificatesData] = useState(null);
  const [user, setUser] =useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setUser(storedUser)
      setToken(storedUser.JWTToken);
  
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
  }, []);

  const handleArrowClick = async (date) => {
    const data = {
      issuerId: "0xeC83A7E6c6b2955950523096f2522cbF00EE88b3",
      date: date
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-batch-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setCertificatesData(result?.data);
    } catch (error) {
      console.error('Error fetching certificates data:', error);
      // Handle error
    }
  };

  return (
    <Container className='batch-wrapper-dates'>
      {certificatesData ? (
        <GalleryCertificates certificatesData={certificatesData} />
      ) : (
        dates?.map((date) => (
          <div key={date} className='batch-date-container'>
            <div className='badge-wrapper col-3 '>
              <div className='badge-wrapper-inner '>
                <Image width={20} height={50} className='badge-cert' src='/icons/badge-cert.svg' alt='Badge' />
              </div>
            </div>
            <div className='col-6 dates-name'>
              <p style={{ fontWeight: 'bold' }}>{date}</p>
            </div>
            <div className='right-arrow-dates col-2' onClick={() => handleArrowClick(date)}>
              <span style={{ color: '#CFA935', cursor: 'pointer' }}>→</span>
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default BatchDates;
