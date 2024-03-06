import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Form, Table, Modal } from 'react-bootstrap';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';

/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */

const DownloadCertificate = ({ cardId }) => {
    const router = useRouter();
    const [apiResponseData, setApiResponseData] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [prevModal, setPrevModal] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [token, setToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [organization, setOrganization] = useState(null);

    // Get the selected template from the previous screeen
    const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
    // const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;
    const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_1.png`;

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
    

    useEffect(() => {
      const { data } = router.query;
      if (data) {
          // Parse the JSON data if it exists
          const parsedData = JSON.parse(data);
          setApiResponseData(parsedData);
      }
    }, [router.query.data]);

     // Count the number of items in the data object
    //  let dataItemCount = 0;
    //   if (apiResponseData && apiResponseData.data) {
    //       dataItemCount = Array.isArray(apiResponseData.data) ? apiResponseData.data.length : Object.keys(apiResponseData.data).length;
    //   }

    //  console.log("Count: ", dataItemCount)

    if (!apiResponseData || !apiResponseData?.details) {
      // If certificateData is null or does not have details, return null or display an error message
        return <p>Error: Certificate data not available.</p>;
    }
    
    const { details } = apiResponseData; 

    
    const handleDownloadPDF = async (apiResponseData) => {
      // console.log("test details: ", details)
      try {
      // setIsLoading(true);
        const res = await fetch('/api/generatePDF', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiResponseData }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `certificate_${details.certificateNumber}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } else {
          console.error('Failed to fetch PDF:', res.statusText);
        }
      } catch (error) {
        console.error('Error downloading PDF:', error);
      } finally {
          // setIsLoading(false);
      }
  }; 

    // Toggle Grid / List view
    const toggleViewMode = () => {
      setIsGridView(!isGridView); // Toggle the view mode
    };

     // Toggle Check/Uncheck onclick on Thumbnail certificate
    const handleCheckboxClick = () => {
      setIsChecked(!isChecked);
    };

    // Triger Preview Modal
    const handlePrevCert = () => {
      setPrevModal(true)
    }

    // close Preview Modal
    const closePrevCert = () => {
      setPrevModal(false)
    }

    // Check/Uncheck table data
    const handleCheckboxChange = (event, index) => {
      const isChecked = event.target.checked;
      setCheckedItems(prevState => ({
        ...prevState,
        [index]: isChecked
      }));
    };

    // Check/Uncheck all table data
    const handleSelectAllChange = (event) => {
      const isChecked = event.target.checked;
      setAllChecked(isChecked);
      const updatedCheckedItems = {};
      for (let i = 0; i < tableData.length; i++) {
        updatedCheckedItems[i] = isChecked;
      }
      
      // setCheckedItems(updatedCheckedItems);
      
      const newCheckedItems = {};
      const newState = !selectAll;
      setSelectAll(newState);
      gridData.forEach((item, index) => {
        newCheckedItems[index] = newState;
      });

      setCheckedItems(updatedCheckedItems && newCheckedItems);
    };

    // Update the searchQuery state
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
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
                    <div className='label'>No. of certificates to be issued</div>
                    <div className='detail'>20</div>
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
                  <Button label='Download Certificate' className='golden-download w-50' />
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
                            <div className='cert-prev' onClick={handleCheckboxClick}>
                              <Image 
                                src={certificateUrl}
                                layout='fill'
                                objectFit='contain'
                                alt={`Certificate ${parsedCardId + 1}`}
                              />
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                              <Form.Group controlId={`Certificate ${parsedCardId + 1}`}>
                                <Form.Check 
                                  type="checkbox" 
                                  label={detail.certificateNumber} 
                                  checked={checkedItems[index] || false}
                                  onChange={(event) => handleCheckboxChange(event, index)}
                                />
                              </Form.Group>
                              <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                                <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={handlePrevCert}>
                                  <Image 
                                    src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                    width={16}
                                    height={16}
                                    alt='View Certificate'
                                  />
                                </span>
                                <span className='d-flex align-items-center' style={{ columnGap: "10px" }} 
                                  onClick={() => handleDownloadPDF(detail)}>
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
                              <div className='trigger-icons' onClick={handlePrevCert}>
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
                src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                layout='fill'
                objectFit='contain'
                alt='Certificate'
              />
            </div>
            <div className='text-center'>
              <Button label='Download' className='golden' />
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default DownloadCertificate;
