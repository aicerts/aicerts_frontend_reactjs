import React, { useState } from 'react'
import {  Image, Modal } from 'react-bootstrap';
const AdminTable = ({data, tab}) => {
  const [show, setShow] = useState(false);
  const rowHeadName=((tab)=>{
if(tab===0){
  return "New Expiration Date"
}
else if(tab === 1){
  return "Reactive"
}
else if(tab === 2){
  return "Revoke Certification"
}

  })

  const rowAction = (tab) => {
    if (tab === 0) {
      return <div onClick={()=>{setShow(true)}} className='btn-new-date'>Set a new Date</div>;
    }
    else if (tab === 1) {
      return (
        <div className='btn-reactive' >
          <label>
            <input type="checkbox" name="yes" /> Yes
          </label>
          <label>
            <input type="checkbox" name="no" /> No
          </label>
          
        </div>
      );
    }
    else if (tab === 2) {
      return <div className='btn-revoke'>Revoke Certificate</div>;
    } 
  };
  return (
    <table className="table table-bordered">
  <thead >
    <tr >
      <th scope="col"  style={{backgroundColor:"#f3f3f3"}}>S. No.</th>
      <th scope="col" style={{backgroundColor:"#f3f3f3"}}>Name</th>
      <th scope="col" style={{backgroundColor:"#f3f3f3"}}>Certificate Number</th>
      <th scope="col" style={{backgroundColor:"#f3f3f3"}}>Expiration Date</th>
      <th scope="col" style={{backgroundColor:"#f3f3f3"}} >{rowHeadName(tab)}</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item)=>{
      return(
        <tr key={item.id}>
        <th scope="row">{item?.Sno}</th>
        <td>{item?.Name}</td>
        <td>{item?.certificateNumber}</td>
        <td>{item?.ExpirationDate}</td>
        <td>{rowAction(tab)}</td>
      </tr>
      )
    })}
  
  </tbody>
  <Modal style={{borderRadius:"26px"}} className='extend-modal' show={show} centered>
    <Modal.Header className='extend-modal-header'>
      <span className='extend-modal-header-text'>Set a New Expiration Date</span>
      <Image
      onClick={()=>{setShow(false)}}
      className='cross-icon'
      src="/icons/close-icon.svg"
      layout='fill'
      objectFit='contain'
      alt='Loader'
                  />
      
    </Modal.Header>
    <Modal.Body style={{display:"flex", flexDirection:"column", textAlign:"left"}}>
    <span className='extend-modal-body-text'>Expiring on 20th March 2024</span>
    <hr style={{width:"100%", background:"#D5DDEA"}}/>
    <span className='extend-modal-body-expire'>New Expiration Date</span>
    <input className='input-date-modal' type='date' />
    <div className='checkbox-container-modal' >
        <input type="checkbox" id="neverExpires" style={{marginRight: "5px"}} />
        <label className='label-modal' htmlFor="neverExpires">Never Expires</label>
    </div>
</Modal.Body>
<Modal.Footer>
    <button className="update-button-modal">Update and Issue New Certification</button>
</Modal.Footer>

      </Modal>
</table>
  )
}

export default AdminTable
