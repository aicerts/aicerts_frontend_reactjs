// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router'; 
import { useContext } from 'react';
import CertificateContext from "../utils/CertificateContext"

const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
const adminApiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;

/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const UploadPdfQr = ({ cardId, handleFileChange,setSelectedFile,selectedFile,setShowPdf }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(0);


  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const handleSuccessClose = () => {
    setShow(false);
    // router.push('/certificate/download');
  };

  // // @ts-ignore
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileName = file.name;
  //     const fileType = fileName.split('.').pop(); // Get the file extension
  //     const fileSize = file.size / 1024; // Convert bytes to KB
  //     if (
  //       fileType.toLowerCase() === 'xlsx' &&
  //       fileSize >= 10 &&
  //       fileSize <= 50
  //     ) {
  //       setSelectedFile(file);
  //     } else {
  //       let message = '';
  //       if (fileType.toLowerCase() !== 'xlsx') {
  //         message = 'Only XLSX files are supported.';
  //       } else if (fileSize < 10) {
  //         message = 'File size should be at least 10KB.';
  //       } else if (fileSize > 50) {
  //         message = 'File size should be less than or equal to 50KB.';
  //       }
  //       // Notify the user with the appropriate message
  //       setError(message);
  //       setShow(true)
  //     }
  //   }
  // };  

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };





  return (
    <>
      <div className=' dashboard pt-0 pb-5 '>
        <Container>
          <Row>
           
            <Col xs={12} md={12}>
              <div className='bulk-upload'>
                <div className='browse-file text-center'>
                  <div className='download-icon position-relative'>
                    <Image
                      src={`${iconUrl}/cloud-upload.svg`}
                      layout='fill'
                      objectFit='contain'
                      alt='Upload icon'
                    />
                  </div>
                  <h4 className='tagline'>Upload  your batch issue certification file here.</h4>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="pdf" />
                  <Button label="Choose File" className='outlined' onClick={handleClick} />
                  {selectedFile && (
                    <div>
                      <p className='mt-4'>{selectedFile?.name}</p>
                    </div>
                  )}
                  <div className='restriction-text'>Only <strong>PDF</strong> is supported. <br/>(100KB - 5MB)</div>
                
                </div>
              </div>
            </Col>
          </Row>
          <div className='d-flex justify-content-end mt-2 next-btn-container'>
          <Button label="Next" disabled={!selectedFile} className='golden' onClick={()=>{setShowPdf(true)}}/>
          </div>
          
        </Container>
      </div>
      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
          <Modal.Body style={{display:"flex" , flexDirection:"column",textAlign:"center"}}>
              <div  className='certificate-loader'>
                  <Image
                      src="/icons/create-certificate.gif"
                      layout='fill'
                      objectFit='contain'
                      alt='Loader'
                  />
              </div>
              <div className='text'>Issuing the batch certificates.</div>
              <ProgressBar now={now} label={`${now}%`} />
          </Modal.Body>
      </Modal>

      <Modal  className='loader-modal text-center' show={show} centered onHide={handleClose}>
    <Modal.Body  style={{minHeight:"500px"}}  >
        {error && (
            <>
                <div className='error-icon'>
                    <Image
                        src="/icons/invalid-password.gif"
                        layout='fill'
                        objectFit='contain'
                        alt='Loader'
                    />
                </div>
                <div className='text' style={{ color: '#ff5500' }}>{error}</div>
                <div className='d-flex flex-row flex-wrap text-cert-wrapper'>
                </div>   
                <button className='warning' onClick={handleClose}>Ok</button>
            </>
        )}
    </Modal.Body>
</Modal>

    </>
  );
};

UploadPdfQr.propTypes = {
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default UploadPdfQr;
