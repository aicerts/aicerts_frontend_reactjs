import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GalleryCertificates from '../components/gallery-certificates';
import BatchDates from '../components/batch-dates';
import Image from 'next/legacy/image';
import BackIcon from "../../public/icons/back-icon.svg";
import { Modal } from 'react-bootstrap';
import SearchAdmin from '../components/searchAdmin';

const Gallery = () => {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("Single Issuance");
  const [subTitle, setSubTitle] = useState("With PDF");
  const [singleWithCertificates, setSingleWithCertificates] = useState([]);
  const [singleWithoutCertificates, setSingleWithoutCertificates] = useState([]);
  const [batchCertificatesData, setBatchCertificatesData] = useState(null);

  const [dates, setDates] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [searchLoading, setSearchLoading] = useState(false); // New state for search loading
  const [filteredSingleWithCertificates, setFilteredSingleWithCertificates] = useState([]);
  const [filteredSingleWithoutCertificates, setFilteredSingleWithoutCertificates] = useState([]);
  const [filteredBatchCertificatesData, setFilteredBatchCertificatesData] = useState(null);
  const router = useRouter();
  const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL_admin;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken) {
      setUser(storedUser);
      setToken(storedUser.JWTToken);
      fetchData(storedUser);
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (storedUser) => {
    await Promise.all([
      fetchSingleWithPdfCertificates(storedUser),
      fetchSingleWithoutCertificates(storedUser),
      fetchBatchDates(storedUser),
    ]);
    setLoading(false);
  };

  const handleChange = (value) => {
    setTab(value);
    if (value === 0) {
      setTitle("Single Issuance");
      setSubTitle("With PDF");
      setFilteredSingleWithCertificates(singleWithCertificates);
    } else if (value === 1) {
      setTitle("Single Issuance");
      setSubTitle("Without PDF");
      setFilteredSingleWithoutCertificates(singleWithoutCertificates);
    } else if (value === 2) {
      setTitle("Batch Issuance");
      setSubTitle("");
      setFilteredBatchCertificatesData(batchCertificatesData);
    }
  };

  const fetchSingleWithoutCertificates = async (storedUser) => {
    setLoading(true)
    const data = {
      issuerId: storedUser.issuerId,
      type: 2
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-single-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(data)
      });
      const certificatesData = await response.json();
      setSingleWithoutCertificates(certificatesData?.data);
      setFilteredSingleWithoutCertificates(certificatesData?.data);
    } catch (error) {
      console.error('Error ', error);
    } finally {
      setLoading(false)
    }
  };

  const fetchSingleWithPdfCertificates = async (storedUser) => {
    setLoading(true)
    const data = {
      issuerId: storedUser.issuerId,
      type: 1
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-single-certificates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(data)
      });
      const certificatesData = await response.json();
      setSingleWithCertificates(certificatesData?.data);
      setFilteredSingleWithCertificates(certificatesData?.data);
    } catch (error) {
      console.error('Error ', error);
    } finally {
      setLoading(false)
    }
  };

  const fetchBatchDates = async (storedUser) => {
    setLoading(true)
    const data = {
      issuerId: storedUser.issuerId,
    };

    try {
      const response = await fetch(`${apiUrl_Admin}/api/get-batch-certificate-dates`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(data)
      });
      const datesData = await response.json();
      setDates(datesData?.data);
    } catch (error) {
      console.error('Error ', error);
    } finally {
      setLoading(false)
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setSearchLoading(true);
    setTimeout(() => { // Simulate network request
      const filteredData = (data) => {
        return data.filter(item => item.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      };

      if (tab === 0) {
        setFilteredSingleWithCertificates(filteredData(singleWithCertificates));
      } else if (tab === 1) {
        setFilteredSingleWithoutCertificates(filteredData(singleWithoutCertificates));
      } else if (tab === 2) {
        setFilteredBatchCertificatesData(filteredData(batchCertificatesData));
      }

      setSearchLoading(false);
    }, 500);
  };

  if (loading) {
    return (
        <Modal className='loader-modal' centered>
          <Modal.Body>
            <div className='certificate-loader'>
                <Image
                    src="/backgrounds/login-loading.gif"
                    layout='fill'
                    objectFit='contain'
                    alt='Loader'
                />
            </div>
            <div className='text'>Issuing the certificate.</div>
          </Modal.Body>
        </Modal>
    );
  }

  return (
    <div className='page-bg gallery-wrapper' >
      <div className='gallery-title'>
        <div className='d-flex   flex-row'>
          {tab === 2 && filteredBatchCertificatesData && (
            <span onClick={() => { setFilteredBatchCertificatesData(null); }} className='back-button'>
              <Image width={10} height={10} src={BackIcon} alt="Filter batch certificate" /><span className=''>Back</span>
            </span>
          )}
          <span className='gallery-title-name'>
            {title}
          </span>
        </div>
        <div className='gallery-button-container'>
          <span onClick={() => { handleChange(0); }} className={`btn ${tab === 0 ? 'btn-golden' : ''}`}>With PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(1); }} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Without PDF</span>
          <span className="vertical-line"></span>
          <span onClick={() => { handleChange(2); }} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Batch</span>
        </div>
      </div>
        {(tab === 0 || tab === 1 || (tab === 2 && filteredBatchCertificatesData)) && (
      <div className='table-title'>
        <span className='expire-typo '>{subTitle}</span>
          {/* <div className='gallery-search-container'>
            <input
              type="text"
              placeholder="Search here..."
              className="d-none d-md-flex search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
             <input
              type="text"
              placeholder="Search here..."
              className="d-flex d-md-none search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className='d-none d-md-flex search-icon-container' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
            <div className='d-flex d-md-none search-icon-container-mobile' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
          </div> */}
          <SearchAdmin setFilteredSingleWithCertificates={setFilteredSingleWithCertificates} setFilteredSingleWithoutCertificates={setFilteredSingleWithoutCertificates} setFilteredBatchCertificatesData={setFilteredBatchCertificatesData} tab={tab}/>
      </div>
        )}
      {searchLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {tab === 0 && <GalleryCertificates certificatesData={filteredSingleWithCertificates} />}
          {tab === 1 && <GalleryCertificates certificatesData={filteredSingleWithoutCertificates} />}
          {tab === 2 && <BatchDates dates={dates} batchCertificatesData={filteredBatchCertificatesData} setFilteredBatchCertificatesData={setFilteredBatchCertificatesData} setBatchCertificatesData={setBatchCertificatesData} />}
        </>
      )}
    </div>
  );
};

export default Gallery;
