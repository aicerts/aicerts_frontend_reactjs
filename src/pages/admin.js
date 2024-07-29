import React, { useEffect, useState } from 'react';
import AdminTable from '../components/adminTable';
import data from "../../public/data.json";
import Image from 'next/image';
import { Modal } from 'react-bootstrap';
import BackIcon from "../../public/icons/back-icon.svg";
import CertificateTemplateThree from '../components/certificate3';


const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const Admin = () => {
  const [tab, setTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [show, setShow] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState(null);

  const handleChange = (value) => {
    setTab(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.JWTToken) {
        // If token is available, set it in the state
        setToken(storedUser.JWTToken);
        setEmail(storedUser.email);
    } else {
        // If token is not available, redirect to the login page
        // router.push("/");
    }
  }, []);

  const fetchData = async (tab, email) => {
    setIsLoading(true);

    try {
      let queryCode;
      if (tab === 1) {
        queryCode = 8;
      } else if (tab === 2) {
        queryCode = 7;
      } else if (tab === 3) {
        queryCode = 6;
      }

      const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          queryCode: queryCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');

      }

      const data = await response.json();
      setResponseData(data);
      setIsBack(false);
    setSearchQuery("")

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = async () => {
    if(!searchQuery) return
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/get-issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email, 
          input: searchQuery, 
          type: tab,
        }),
      });
      if (!response.ok) {
      const data = await response.json();
      setLoginError(data.message || "Network Error");
      setShow(true);
    setIsLoading(false);
    

        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLoginError("")
      setLoginSuccess(data?.message)
      setShow(true);
      setResponseData(data)
    setIsLoading(false);
    setIsBack(true)
    } catch (error) {
      console.error('Error fetching data:', error);
    setIsLoading(false);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className='admin-wrapper page-bg'>
   
      <div className='admin-title flex-column flex-md-row'>
        {isBack &&
      <span onClick={() => { fetchData(tab,email); }} className='back-button'>
              <Image width={10} height={10} src={BackIcon} alt='back' /><span className=''>Back</span>
            </span>
        }
        <span className='admin-title-name'>
          Administration
        </span>
        <div  className='admin-button-container'>
          <span onClick={() => handleChange(1)} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Extend Expiration</span>
          <span className="vertical-line"></span>
          <span onClick={() => handleChange(2)} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Reactivate Certification</span>
          <span className="vertical-line"></span>
          <span onClick={() => handleChange(3)} className={`btn ${tab === 3 ? 'btn-golden' : ''}`}>Revoke Certification</span>
        </div>
      </div>
      <div className='table-title'>
        <span className='expire-typo'></span>
        <div className='admin-search-container'>
          <span>Certificate Number</span>
          <input
          required
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className='search-icon-container' onClick={handleSearchClick}>
            <Image height={10} width={10} src="/icons/search.svg" alt='search' />
          </div>
        </div>
      </div>
      <AdminTable data={responseData} setTab={setTab} tab={tab} setResponseData={setResponseData} responseData={responseData} setIssuedCertificate={setIssuedCertificate} />
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body className='p-5'>
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: 'red' }}>{loginError}</h3>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: '#CFA935' }}>{loginSuccess}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
      <Modal className='loader-modal' show={isLoading} centered>
            <Modal.Body>
                <div className='certificate-loader'>
                    <Image
                        src="/backgrounds/login-loading.gif"
                        layout='fill'
                        alt='Loader'
                    />
                </div>
                <div className='text mt-3'>Updating admin details</div>
            </Modal.Body>
        </Modal>
        {/* </>
           )} */}
    </div>
  );
};

export default Admin;
