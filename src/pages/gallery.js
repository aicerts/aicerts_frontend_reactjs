import React, { useEffect, useState } from 'react'
import GalleryCertificates from '../components/gallery-certificates';
import BatchDates from '../components/batch-dates';
const Gallery = () => {
const [tab, setTab] = useState(1);
const [title, setTitle] =useState("Single Issuance")
const [subTitle, setSubTitle] =useState("With PDF")
const [singleWithCertificates, setSingleWithCertificates] =useState([])
const [singleWithoutCertificates, setSingleWithoutCertificates] =useState([])
const [dates, setDates] =useState([])
const [user, setUser] =useState({});
const [token, setToken] = useState(null);
const apiUrl_Admin = process.env.NEXT_PUBLIC_BASE_URL;

useEffect(() => {
  // Check if the token is available in localStorage
  // @ts-ignore: Implicit any for children prop
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser && storedUser.JWTToken) {
    // If token is available, set it in the state
    setUser(storedUser)
    setToken(storedUser.JWTToken);
    fetchSingleWithoutCertificates();
    fetchBatchDates();
    fetchSingleWithPdfCertificates();

  } else {
    // If token is not available, redirect to the login page
    router.push('/');
  }
}, []);
    const handleChange=((value)=>{
        setTab(value)
        if(value == 0 ){
          setTitle("Single Issuance")
          setSubTitle("With PDF")
        } else if(value == 1){
          setTitle("Single Issuance")
          setSubTitle("Without PDF")
        }
         else if(value == 2){
          setTitle("Batch Issuance")
        }
    })

    
// @ts-ignore: Implicit any for children prop
const fetchSingleWithoutCertificates = async () => {

  const data = {
    issuerId: "0xeC83A7E6c6b2955950523096f2522cbF00EE88b3",
    type: 2
  }

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
      setSingleWithoutCertificates(certificatesData?.data)
  } catch (error) {
      console.error('Error ', error);
      // Handle error
  }



};

  
// @ts-ignore: Implicit any for children prop
const fetchSingleWithPdfCertificates = async () => {

  const data = {
    issuerId: "0xeC83A7E6c6b2955950523096f2522cbF00EE88b3",
    type: 1
  }

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
      setSingleWithCertificates(certificatesData?.data)
  } catch (error) {
      console.error('Error ', error);
      // Handle error
  }



};

    
// @ts-ignore: Implicit any for children prop
const fetchBatchDates = async () => {

  const data = {
    issuerId: "0xeC83A7E6c6b2955950523096f2522cbF00EE88b3",
  }

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
      setDates(datesData?.data)
  } catch (error) {
      console.error('Error ', error);
      // Handle error
  }



};


  return (
    <div>
        <div className='gallery-title'>
<span className='gallery-title-name'>
{title}
</span>
<div  className='gallery-button-container'>
    <span onClick={()=>{handleChange(0)}}  className={`btn ${tab === 0 ? 'btn-golden' : ''}`} >With PDF</span>
    <span className="vertical-line"></span>
    <span onClick={()=>{handleChange(1)}}  className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Without PDF</span>
    <span className="vertical-line"></span>
    <span onClick={()=>{handleChange(2)}}  className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Batch</span>
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
<img src="/icons/search.svg" alt='search'/>
        </div>
      </div>
    </div>
      {tab == 0  && <GalleryCertificates certificatesData ={singleWithCertificates}/> }
      { tab == 1 && <GalleryCertificates certificatesData ={singleWithoutCertificates}/> }
      { tab == 2 && <BatchDates dates={dates} /> }

    </div>
  )
}

export default Gallery;
