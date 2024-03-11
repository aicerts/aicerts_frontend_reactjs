// pages/select-certificate.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation
import Image from 'next/legacy/image';
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
// import image from "public/images/1709909965183_Badge.png"

const CardSelector = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const router = useRouter(); // Initialize useRouter hook
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [token, setToken] = useState(null);
  const [badgeUrl, setBadgeUrl] = useState(null);

  useEffect(() => {
      // Check if the token is available in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.JWTToken) {
        // If token is available, set it in the state
        setToken(storedUser.JWTToken);
      } else {
        // If token is not available, redirect to the login page
        router.push('/');
      }
  }, []);

  const handleClose = () => {
    setShow(false);
};

  const hasErrors = () => {
    const errorFields = Object.values(errors);
    return errorFields.some((error) => error !== '');
  };

  // @ts-ignore
  const handleChange = () => {
    const file = fileInputRef.current?.files[0];
    setSelectedFile(file);
    setBadgeUrl(null)
  };

  console.log("Badge URL: ", selectedFile)

  const handleClick = async () => {
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Save the image reference as needed in your application state or database
      } else {
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      setLoginError("No file selected.")
      setShow(true)
      console.error('No file selected.');
      return;
    }
  
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setLoginError("Invalid file type. Please upload a JPG, PNG, or SVG file.")
      setShow(true)
      console.error('Invalid file type. Please upload a JPG, PNG, or SVG file.');
      return;
    }
  
    setIsLoading(true);
  
    // Check file size
    const maxSize = 170 * 170; // Adjust the size limit as needed
    if (selectedFile.size > maxSize) {
      setLoginError('File size exceeds the allowed limit.');
      setShow(true);
      console.error('File size exceeds the allowed limit.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        setBadgeUrl(data?.fileName || null);
        setLoginSuccess('Badge uploaded successfully');
        setShow(true);
        setIsLoading(false);
        // Save the image reference as needed in your application state or database
      } else {
        setLoginError('Failed to upload badge');
        setShow(true);
        setIsLoading(false);
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      setLoginError('Failed to upload badge');
      setIsLoading(false);
      setShow(true);
      console.error('Error uploading image:', error);
    }
  };
  

  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
  };

  const handleSelectTemplate = () => {
    // Navigate to the new page with the selected card ID as a route parameter
    router.push(`/certificate/${selectedCard}?b=${badgeUrl}`);
  };

  const cards = [
    {
      id: 1,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_1.png',
    },
    {
      id: 2,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_2.png',
    },
    {
      id: 3,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_3.png',
    }
  ];

  useEffect(() => {
    // Select the first card onLoad
    handleCardSelect(0);
  }, []); // Empty dependency array means it runs only once after the component is mounted

  return (
    <Container className='dashboard'>
      <Row>
        <h3 className='page-title'>Batch Issuance</h3>
        <Col xs={12} md={6}>
            <Card className='p-0'>
                <Card.Header>Select a Template</Card.Header>
                <Row className='p-3'>
                    {cards.map((card, index) => (
                        <Col key={card.id} md={4}>
                            <Card className='cert-thumb' style={{ cursor: 'pointer' }} onClick={() => handleCardSelect(index)}>                        
                                <Card.Img variant="top" src={card.imageUrl} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </Col>
        <Col xs="12" md={6}>
        <div className='upload-badge d-block d-md-flex justify-content-between align-items-center'>
          <input type="file" ref={fileInputRef} onChange={handleChange} />
          <div className='d-block text-center text-md-start d-md-flex align-items-center' style={{ columnGap: "16px"}}>
            {/* <div className='icon' onClick={handleClick} style={{ cursor: "pointer" }}>
              <Image 
                src={`${iconUrl}/cloud-upload.svg`}
                width={30}
                height={22}
                alt='Upload Badge'
              />
            </div> */}
            <div> 
          {/* {selectedFile ? (
            <div className='title'>{selectedFile?.name}</div>
          ) : (
            <div className='title d-flex' style={{ columnGap: "10px"}}>
              <span>Upload your Badge</span>  
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">If Badge is not uploaded, it will be blank on every certificate</Tooltip>}>
                <div>
                  <Image 
                    src={`${iconUrl}/information-bg.svg`}
                    width={18}
                    height={18}
                    alt='Upload Badge'
                  />
                </div>
              </OverlayTrigger>                  
            </div>
          )} */}
          
          {/* <div className='info-text'>(Optional)</div> */}
        </div>
      </div>
      <Button disabled={badgeUrl !== null ?true:false} label='Upload Badge' className='golden' onClick={uploadFile} />
    </div>
          
          {selectedCard !== null && (
            <Card className='preview-certificate h-auto'>
              <Card.Header>Preview</Card.Header>
              <Card.Body className='pt-0'>
                <img className='img-fluid' src={cards[selectedCard].imageUrl} alt={`Card ${cards[selectedCard].id}`} />
                <Button label="Select this template" className='golden w-100' onClick={handleSelectTemplate} />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
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
    </Container>
  );
};

export default CardSelector;
