// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
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

const CertificateDisplayPage = ({ cardId }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [show, setShow] = useState(false);
  const {setCertificateUrl, certificateUrl, badgeUrl, setBadgeUrl, logoUrl, setLogoUrl, signatureUrl,setSignatureUrl,setSelectedCard,selectedCard,setIssuerName, setissuerDesignation, certificatesData,setCertificatesData } = useContext(CertificateContext);

  useEffect(() => {
    console.log(badgeUrl,"badge")
    sessionStorage.removeItem('certificatesList');
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken && storedUser.email) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      setUserEmail(storedUser.email)
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Function to retrieve data from session storage and set local state
    const retrieveDataFromSessionStorage = () => {
      const badgeUrlFromStorage = JSON.parse(sessionStorage.getItem("badgeUrl"));
      const logoUrlFromStorage = JSON.parse(sessionStorage.getItem("logoUrl"));
      const signatureUrlFromStorage = JSON.parse(sessionStorage.getItem("signatureUrl"));
      const issuerNameFromStorage =sessionStorage.getItem("issuerName");
      const issuerDesignationFromStorage = sessionStorage.getItem("issuerDesignation");
      if (badgeUrlFromStorage) {
        setBadgeUrl(badgeUrlFromStorage.url)
        // setBadgeFileName(badgeUrlFromStorage.fileName)
      };
      if (logoUrlFromStorage){
        setLogoUrl(logoUrlFromStorage.url);
        // setLogoFileName(logoUrlFromStorage.fileName)

      } 
      if (signatureUrlFromStorage){
        setSignatureUrl(signatureUrlFromStorage.url);
        // setSignatureFileName(signatureUrlFromStorage.fileName)
      } 
      if (issuerNameFromStorage){
        setIssuerName(issuerNameFromStorage);
      } 
      if (issuerDesignationFromStorage){
        setissuerDesignation(issuerDesignationFromStorage);
      } 
    };

    retrieveDataFromSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectTemplate = () => {
    router.push('/certificate');
  }

  const handleDownloadSample = () => {
    // Create a new anchor element
    const anchor = document.createElement('a');
    // Set the href attribute to the path of the file to be downloaded
    anchor.href = '/download-sample.xlsx';
    // Set the download attribute to the desired filename for the downloaded file
    anchor.download = 'sample.xlsx';
    // Append the anchor element to the document body
    document.body.appendChild(anchor);
    // Trigger a click event on the anchor element to initiate the download
    anchor.click();
    // Remove the anchor element from the document body
    document.body.removeChild(anchor);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSuccessClose = () => {
    setShow(false);
    // router.push('/certificate/download');
  };

  // @ts-ignore
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileType = fileName.split('.').pop(); // Get the file extension
      const fileSize = file.size / 1024; // Convert bytes to KB
      if (
        fileType.toLowerCase() === 'xlsx' &&
        fileSize >= 10 &&
        fileSize <= 50
      ) {
        setSelectedFile(file);
        console.log('Selected file:', fileName, file.size, file.type);
      } else {
        let message = '';
        if (fileType.toLowerCase() !== 'xlsx') {
          message = 'Only XLSX files are supported.';
        } else if (fileSize < 10) {
          message = 'File size should be at least 10KB.';
        } else if (fileSize > 50) {
          message = 'File size should be less than or equal to 50KB.';
        }
        // Notify the user with the appropriate message
        setError(message);
        setShow(true)
      }
    }
  };  

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  // Get the data from the API
  const issueCertificates = async () => {
    try {
        setIsLoading(true)
        // Construct FormData for file upload
        const formData = new FormData();
        formData.append('email', userEmail);
        formData.append('excelFile', selectedFile);

        // Make API call
        const response = await fetch(`${adminApiUrl}/api/batch-certificate-issue`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        }
        );

        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
    
        // Parse response body as JSON
        const responseData = await response.json();
       if(responseData?.status == "SUCCESS"){
        setCertificatesData(responseData)
        sessionStorage.setItem("certificatesList",JSON.stringify(responseData))
        router.push({
          pathname: '/certificate/download'
        });

        // Set response data to state
        setResponse(responseData);
        setsuccess("Certificates generated Successfully");
        setShow(true)
       }else{
        setError(responseData.message);
        setShow(true)
       }
    }
    
    catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      setShow(true);
    } finally {
      setIsLoading(false)
    }
  };
  

  const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
  //const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;

  return (
    <>
      <Container className='dashboard pb-5'>
        <Row>
          <h3 className='page-title'>Batch Issuance</h3>
          <Col xs={12} md={4}>
            <Card className='p-0'>
              <Card.Header>Selected Template</Card.Header>
              <Card.Body>
                <Image width={300} height={230}  className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />
                <Button label="Select Another Template" className='outlined btn-select-template mt-5' onClick={handleSelectTemplate} />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={8}>
            <div className='bulk-upload'>
              <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
                <div className='tagline mb-3 mb-md-0'>Please refer to our sample file for batch upload.</div>
                <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative' onClick={handleDownloadSample} />
              </div>
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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".xlsx" />
                <Button label="Choose File" className='outlined' onClick={handleClick} />
                {selectedFile && (
                  <div>
                    <p className='mt-4'>{selectedFile?.name}</p>
                    <Button label="Validate and Issue" className='golden'
                      onClick={() =>
                        issueCertificates()
                      }
                    />
                  </div>
                )}
                <div className='restriction-text'>Only <strong>XLSX</strong> is supported. <br/>(10KB - 50KB)</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Loading Modal for API call */}
      <Modal className='loader-modal' show={isLoading} centered>
          <Modal.Body style={{display:"flex" , flexDirection:"column",textAlign:"center"}}>
              <div  className='certificate-loader'>
                  <Image
                      src="/backgrounds/login-loading.gif"
                      layout='fill'
                      objectFit='contain'
                      alt='Loader'
                  />
              </div>
                  <p>Please dont reload the Page.It may take few minutes</p>
          </Modal.Body>
      </Modal>

      <Modal className='loader-modal text-center' show={show} centered>
          <Modal.Body className='p-5'>
              {error && (
                  <>
                      <div className='error-icon'>
                          <Image
                              src="/icons/close.svg"
                              layout='fill'
                              objectFit='contain'
                              alt='Loader'
                          />
                      </div>
                      <h3 style={{ color: 'red' }}>{error}</h3>
                      <button className='warning' onClick={handleClose}>Ok</button>
                  </>
              )}
          </Modal.Body>
      </Modal>
    </>
  );
};

CertificateDisplayPage.propTypes = {
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default CertificateDisplayPage;
