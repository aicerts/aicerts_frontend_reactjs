import React, { useState } from 'react'
import AdminTable from '../components/adminTable'
import data from "../../public/data.json"
const Admin = () => {
const [tab, setTab] = useState(0)
    const handleChange=((value)=>{
        setTab(value)
    })
  return (
    <div>
        <div className='admin-title'>
<span className='admin-title-name'>
Administration
</span>
<div  className='admin-button-container'>
    <span onClick={()=>{handleChange(0)}}  className={`btn ${tab === 0 ? 'btn-golden' : ''}`} >Extend Expiration</span>
    <span className="vertical-line"></span>
    <span onClick={()=>{handleChange(1)}}  className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>Reactivate Certification</span>
    <span className="vertical-line"></span>
    <span onClick={()=>{handleChange(2)}}  className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>Revoke Certification</span>
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
  />
        <div className='search-icon-container'>
<img src="/icons/search.svg" alt='search'/>
        </div>
      </div>
      
    </div>
      <AdminTable data={data} setTab={setTab} tab={tab} />
    </div>
  )
}

export default Admin
