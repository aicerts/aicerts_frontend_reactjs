import React, { useEffect, useState } from 'react'
import GalleryCertificates from '../components/gallery-certificates';
const Gallery = () => {
const [tab, setTab] = useState(0);
const [title, setTitle] =useState("Single Issuance")
const [subTitle, setSubTitle] =useState("With PDF")
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
      {tab == 0 || tab == 1 && <GalleryCertificates/> }
      { tab == 2 && <GalleryCertificates/> }

    </div>
  )
}

export default Gallery;
