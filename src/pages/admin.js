import React, { useEffect, useState } from 'react';
import AdminTable from '../components/adminTable';
import data from "../../public/data.json";
import Image from 'next/image';
import { Modal } from 'react-bootstrap';
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
        router.push("/");
    }
  }, []);

  const handleSearchClick = async () => {
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
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLoginError("")
      setLoginSuccess(data?.message)
      setShow(true);
      setResponseData(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div className='admin-title'>
        <span className='admin-title-name'>
          Administration
        </span>
        <div className='admin-button-container'>
          <span onClick={() => handleChange(1)} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Extend Expiration</span>
          <span className="vertical-line"></span>
          <span onClick={() => handleChange(2)} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Reactivate Certification</span>
          <span className="vertical-line"></span>
          <span onClick={() => handleChange(3)} className={`btn ${tab === 3 ? 'btn-golden' : ''}`}>Revoke Certification</span>
        </div>
      </div>
      <div className='table-title'>
        <span className='expire-typo'>Expiration Date</span>
        <div className='admin-search-container'>
          <span>Certificate Number</span>
          <input
            type="text"
            placeholder="Search here..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className='search-icon-container' onClick={handleSearchClick}>
            <Image height={10} width={10} src="/icons/search.svg" alt='search' />
          </div>
        </div>
      </div>
      <AdminTable data={responseData} setTab={setTab} tab={tab} setResponseData={setResponseData} responseData={responseData} />
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
        <Modal.Body className='p-5'>
          {loginError !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/close.svg"
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
                  src="/icons/check-mark.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Admin;
