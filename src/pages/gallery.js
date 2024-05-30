import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import GalleryCertificates from '../components/gallery-certificates';
import BatchDates from '../components/batch-dates';

const Gallery = () => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("Single Issuance");
  const [subTitle, setSubTitle] = useState("With PDF");
  const [singleWithCertificates, setSingleWithCertificates] = useState([]);
  const [singleWithoutCertificates, setSingleWithoutCertificates] = useState([]);
  const [dates, setDates] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      setUser(storedUser);
      setToken(storedUser.JWTToken);
      fetchData(storedUser.JWTToken);
    } else {
      router.push('/');
    }
  }, []);

  const fetchData = async (token) => {
    await Promise.all([
      fetchSingleWithPdfCertificates(token),
      fetchSingleWithoutCertificates(token),
      fetchBatchDates(token),
    ]);
    setLoading(false);
  };

  const handleChange = (value) => {
    setTab(value);
    if (value === 0) {
      setTitle("Single Issuance");
      setSubTitle("With PDF");
    } else if (value === 1) {
      setTitle("Single Issuance");
      setSubTitle("Without PDF");
    } else if (value === 2) {
      setTitle("Batch Issuance");
      setSubTitle("");
    }
  };

  const fetchSingleWithoutCertificates = async (token) => {
    const data = {
      issuerId: user.issuerId,
      type: 2
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-single-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      const certificatesData = await response.json();
      setSingleWithoutCertificates(certificatesData?.data);
    } catch (error) {
      console.error('Error ', error);
    }
  };

  const fetchSingleWithPdfCertificates = async (token) => {
    const data = {
      issuerId: user.issuerId,
      type: 1
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-single-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      const certificatesData = await response.json();
      setSingleWithCertificates(certificatesData?.data);
    } catch (error) {
      console.error('Error ', error);
    }
  };

  const fetchBatchDates = async (token) => {
    const data = {
      issuerId: user.issuerId,
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-batch-certificate-dates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      const datesData = await response.json();
      setDates(datesData?.data);
    } catch (error) {
      console.error('Error ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='gallery-title'>
        <span className='gallery-title-name'>
          {title}
        </span>
        <div className='gallery-button-container'>
          <span onClick={() => { handleChange(0) }} className={`btn ${tab === 0 ? 'btn-golden' : ''}`} >With PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(1) }} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Without PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(2) }} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Batch</span>
        </div>
      </div>
      <div className='table-title'>
        <span className='expire-typo'>{subTitle}</span>
        <div className='gallery-search-container'>
          <input
            type="text"
            placeholder="Search here..."
            className="search-input"
          />
          <div className='search-icon-container'>
            <img src="/icons/search.svg" alt='search' />
          </div>
        </div>
      </div>
      {tab === 0 && <GalleryCertificates certificatesData={singleWithCertificates} />}
      {tab === 1 && <GalleryCertificates certificatesData={singleWithoutCertificates} />}
      {tab === 2 && <BatchDates dates={dates} />}
    </div>
  );
}

export default Gallery;
