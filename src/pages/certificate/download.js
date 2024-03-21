import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Form, Table, Modal } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import JSZip from 'jszip';
import { useContext } from 'react';
import CertificateContext from "../../utils/CertificateContext"
import AWS from "../../config/aws-config"
/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const DownloadCertificate = () => {
    const router = useRouter();
    const [apiResponseData, setApiResponseData] = useState(null);   
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [prevModal, setPrevModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [imagesGenerated, setImagesGenerated] = useState(false);
    const [token, setToken] = useState(null);
    const [cardId, setCardId] = useState(0);
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [certificateNumber, setCertificateNumber] = useState(null);
    const [imageUrlList, setImageUrlList] = useState([]);
    const [detailsArray, setDetailsArray] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [keyUrl, setKeyUrl] = useState("");
    // const [badgeUrl, setBadgeUrl] = useState("");
    const [singleDetail, setSingleDetail] = useState({});
    const { badgeUrl,certificateUrl,logoUrl,signatureUrl,issuerName,issuerDesignation } = useContext(CertificateContext);
    // Get the selected template from the previous screeen
    
  const generatePresignedUrl = async (key) => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET,
      Key: key,
      Expires: 3600, 
    };
  
    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      return null;
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  // Fetch certificate data from the API and generate image URLs
  const handleShowImages = async (detail, message, polygonLink, status) => {


    try {
      const res = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detail, message, polygonLink, status, certificateUrl,logoUrl,signatureUrl,issuerName,issuerDesignation }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUrlList(prevList => [...prevList, imageUrl]);
      } else {
        console.error('Failed to fetch PDF:', res.statusText);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  // Effect hook to fetch data when component mounts or query data changes
  useEffect(() => {
    const fetchData = async () => {
      const { cardId, data } = router.query;
    
      if (cardId) {
        setCardId(cardId);
      }
      if (data) {
        // Parse the JSON data if it exists
        const parsedData = JSON.parse(data);
        setApiResponseData(parsedData);
        if (parsedData && parsedData.details && Array.isArray(parsedData.details)) {
          setCertificateNumber(parsedData.details.length);
      } else {
          // Handle case where details array is missing or not an array
          setCertificateNumber(0); // Or perform other error handling
      }
        // Iterate over details and call handleShowImages
        setIsImageLoading(true);

        if (parsedData?.details && parsedData?.details?.length > 0) {
          try {
            // Use Promise.all to wait for all promises to resolve
            await Promise.all(parsedData.details.map(detail =>
              handleShowImages(detail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)
            ));
          } catch (error) {
            console.error('Error in handleShowImages:', error);
          } finally {
            setIsImageLoading(false);
          }
        }
      }
    };

    fetchData(); // Call the async function

  }, [router.query.data]);

  // Effect hook to check if the user is logged in
  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.JWTToken && storedUser.email && storedUser.name && storedUser.organization) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
      setUserEmail(storedUser.email);
      setUserName(storedUser.name)
      setOrganization(storedUser.organization)
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
  }, []);

  // Certificate URL based on cardId
  const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;

  useEffect(() => {
    console.log(badgeUrl)
    if(badgeUrl){
     
    const fetchImageUrl = async () => {
        const url = await generatePresignedUrl(badgeUrl);
        if (url) {
          setKeyUrl(url);
          console.log(url,"url")
        }
      }
     
      fetchImageUrl();
    };
  }, []);


  // Display error if certificate data is not available
  if (!apiResponseData) {
    return (<div class="wait-message"><p>Please wait while we load your data</p></div>);
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);

    // Filter the details array based on the certificateNumber
    const filteredDetails = apiResponseData?.details?.filter((detail) =>
      detail.certificateNumber?.toLowerCase().includes(searchValue.toLowerCase())
    );

    setDetailsArray(filteredDetails);
  };

 

  // Handle download PDF for a single certificate
  const handleDownloadPDF = async (detail, message, polygonLink, status) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/generatePDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detail,certificateUrl,logoUrl,signatureUrl,badgeUrl,issuerName,issuerDesignation}),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate_${detail.certificateNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoginError("")
        setLoginSuccess("Certification Downloaded")
        setShow(true)
      } else {
        console.error('Failed to fetch PDF:', res.statusText);
        setLoginError("Error downloading PDF")
        setShow(true)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setLoginError("Error downloading PDF")
      setShow(true)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download PDFs for multiple certificates
  const handleDownloadPDFs = async () => {
    setIsLoading(true);

    try {
      const zip = new JSZip();
      const { message, polygonLink, status } = apiResponseData
      for (const detail of detailsArray) {
        const res = await fetch('/api/generatePDF', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            detail,certificateUrl,logoUrl,signatureUrl,badgeUrl,issuerName,issuerDesignation
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          zip.file(`certificate_${detail.certificateNumber}.pdf`, blob);
        } else {
          console.error('Failed to fetch PDF:', res.statusText);
          setLoginError("Error downloading PDF");
          setShow(true);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.setAttribute('download', 'certificates.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setLoginError('');
      setLoginSuccess('Certificates Downloaded');
      setShow(true);
    } catch (error) {
      console.error('Error downloading PDFs:', error);
      setLoginError('Error downloading PDFs');
      setShow(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Grid / List view
  const toggleViewMode = () => {
    setIsGridView(!isGridView); // Toggle the view mode
  };

  // Triger Preview Modal
  const handlePrevCert = (url, detail) => {
    setPrevModal(true)
    setImageUrl(url)
    setSingleDetail(detail)
  };

  // Close Preview Modal
  const closePrevCert = () => {
    setPrevModal(false)
  };

  // Check/Uncheck table data
  const handleCheckboxChange = (event, index) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: isChecked,
    }));

    const selectedDetail = apiResponseData?.details?.find(
      (detail, i) => i === index
    );

    if (isChecked) {
      setDetailsArray((prevDetails) => [...prevDetails, selectedDetail]);
    } else {
      setDetailsArray((prevDetails) =>
        prevDetails.filter(
          (detail) => detail.certificateNumber !== selectedDetail?.certificateNumber
        )
      );
    }
  };

  // Toggle selection of all certificates
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;

    setSelectAll(newSelectAll);

    if (newSelectAll) {
      // If "Select All" is checked, store all details in the state
      setDetailsArray(apiResponseData?.details || []);
      setCheckedItems(
        apiResponseData?.details.reduce((acc, _, index) => {
          acc[index] = true;
          return acc;
        }, {})
      );
    } else {
      // If "Select All" is unchecked, clear the state
      setDetailsArray([]);
      setCheckedItems({});
    }
  };

    return (
      <>
        <Container className='dashboard pb-5 pt-5'>
          <Row>
          
            <Col xs={12} md={4}>
              <h3 className='page-title mt-0'>Batch Issuance</h3>
              <Card className='p-0 h-auto'>
                <Card.Header>Selected Template</Card.Header>
                <Card.Body>
                  <div className='issued-info'>
                    <div className='label'>No. of Certification to be issued</div>
                    <div className='detail'>{certificateNumber}</div>
                    <div className='label'>Organisation</div>
                    <div className='detail'>{organization}</div>
                    <div className='label'>Issuer</div>
                    <div className='detail'>{userName}</div>
                    <div className='label'>Email</div>
                    <div className='detail'>{userEmail}</div>
                    <div className='label'>Selected Template</div>
                    <img className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />  
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <div className='cert-list'>
                <div className="search-wrapper d-flex align-items-center">
                  <Form.Group controlId="search" className='w-100'>
                    <div className="password-input position-relative">
                      <Form.Control 
                          type='text'
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Seach Certificate"
                      />
                      <div className='eye-icon position-absolute'>
                          <Image
                              src="https://images.netcomlearning.com/ai-certs/icons/search-icon-transparent.svg"
                              width={20}
                              height={20}
                              alt="Search certificate"
                              className="password-toggle"
                          />
                      </div>
                    </div>
                  </Form.Group>
                  <Button onClick={handleDownloadPDFs} label='Download Certificate' className='golden-download w-50' />
                  <div className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                    <div className='icon' onClick={toggleViewMode}>
                      {isGridView ? (
                        <Image 
                          src="https://images.netcomlearning.com/ai-certs/icons/list.svg"
                          layout='fill'
                          objectFit='contain'
                          alt='List View'
                        />
                      ):(
                        <Image 
                          src="https://images.netcomlearning.com/ai-certs/icons/grid.svg"
                          layout='fill'
                          objectFit='contain'
                          alt='Grid View'
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className='select-all'>
                  <Form.Group className="mb-3" controlId="select-all">
                    <Form.Check type="checkbox" label="Select All" 
                       checked={selectAll} 
                       onChange={handleSelectAllChange}
                    />
                  </Form.Group>
                </div>
                {isGridView ? (
                  <div className='grid-view'>
                    
                    <Row>
                      {apiResponseData?.details?.map((detail, index) => (
                      
                        <Col key={index} xs={12} md={4}>
                          <div className='prev-cert-card'>
                            <div className='cert-prev' >
                              {
                                isImageLoading?
                                <div class="image-container skeleton"></div>
                                :
                                <Image 
                                src={imageUrlList[index]}
                                layout='fill'
                                objectFit='contain'
                                alt={`Certificate ${parsedCardId + 1}`}
                              />
                              }
  
                            
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                              <Form.Group controlId={`Certificate ${parsedCardId + 1}`}>
                                <Form.Check 
                                  type="checkbox" 
                                  label= {detail?.certificateNumber && detail?.certificateNumber.length > 5
                                    ? `${detail?.certificateNumber.substring(0, 5)}...`
                                    : detail?.certificateNumber} 
                                  checked={checkedItems[index] || false}
                                  onChange={(event) => handleCheckboxChange(event, index)}
                                />
                              </Form.Group>
                              <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                                <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={()=>handlePrevCert(imageUrlList[index], detail)}>
                                  <Image 
                                    src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                    width={16}
                                    height={16}
                                    alt='View Certificate'
                                  />
                                </span>
                                <span className='d-flex align-items-center' style={{ columnGap: "10px" }} 
                                  onClick={() => handleDownloadPDF(detail,apiResponseData?.message,apiResponseData?.polygonLink,apiResponseData?.status)}>
                                  <Image 
                                    src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                    width={16}
                                    height={16}
                                    alt='Download Certificate'
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ):(
                  <div className='list-view-table'>
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>
                            <div className='d-flex align-items-center justify-content-center'>
                              <span>S.No</span>
                            </div>
                          </th>
                          <th><span>Issuer Name</span></th>
                          <th><span>Certificate Number</span></th>
                          <th><span>View</span></th>
                          <th><span>Download</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiResponseData?.details?.map((detail, index) => (
                          <tr key={index}>
                            <td>
                              <div className='d-flex align-items-center '>
                                <Form.Check
                                  type="checkbox"
                                  aria-label={`option ${index}`}
                                  checked={checkedItems[index] || false}
                                  onChange={(event) => handleCheckboxChange(event, index)}
                                />
                                <span>{index + 1}.</span>
                              </div>
                            </td>
                            <td>{detail.name}</td>
                            <td>{detail.certificateNumber}</td>
                            <td>
                              <div className='trigger-icons' onClick={()=>handlePrevCert(imageUrlList[index],detail)}>
                                <Image 
                                  src="https://images.netcomlearning.com/ai-certs/icons/eye-bg.svg"
                                  layout='fill'
                                  objectFit='contain'
                                  alt='View certificate'
                                />
                              </div>
                            </td>
                            <td>
                              <div className='trigger-icons'>
                                <Image 
                                  src="https://images.netcomlearning.com/ai-certs/icons/download-bg.svg"
                                  layout='fill'
                                  objectFit='contain'
                                  alt='Download Certificate'
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}                
              </div>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          centered
          className='preview-modal'
          show={prevModal}
        >
          <Modal.Body>
            <div className='close-modal' onClick={closePrevCert}>
              <Image 
                src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                layout='fill'
                objectFit='contain'
                alt='Certificate'
              />
            </div>
            <div className='prev-cert'>
              <Image 
                src={imageUrl}
                layout='fill'
                objectFit='contain'
                alt='Certificate'
              />
            </div>
            <div className='text-center'>
              <Button label='Download' className='golden' onClick={() => handleDownloadPDF(singleDetail,apiResponseData?.message,apiResponseData?.polygonLink,apiResponseData?.status)}  ></Button>  
            </div>
          </Modal.Body>
        </Modal>
        {/* Loading Modal for API call */}
        <Modal className='loader-modal' show={isLoading} centered>
                    <Modal.Body>
                        <div className='certificate-loader'>
                            <Image
                                src="/backgrounds/login-loading.gif"
                                layout='fill'
                                objectFit='contain'
                                alt='Loader'
                            />
                        </div>
                    </Modal.Body>
                </Modal>

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
                        ): (
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
      </>
    );
}

export default DownloadCertificate;
