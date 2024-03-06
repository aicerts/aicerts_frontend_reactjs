// pages/select-certificate.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation
import Image from 'next/legacy/image';
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;

const CardSelector = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const router = useRouter(); // Initialize useRouter hook
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [token, setToken] = useState(null);

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

  const hasErrors = () => {
    const errorFields = Object.values(errors);
    return errorFields.some((error) => error !== '');
  };

  // @ts-ignore
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileName = file?.name
    setSelectedFile(file);
    console.log('Selected file:', fileName, file?.size, file?.type);
  };

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const uploadFile = async () => {
    // window.location.href = '/certificate/download'
    if (!selectedFile) {
      return;
    }

    setSelectedFile(null); // Clear selection after upload
  };

  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
  };

  const handleSelectTemplate = () => {
    // Navigate to the new page with the selected card ID as a route parameter
    router.push(`/certificate/${selectedCard}`);
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
            <div className='d-block text-center text-md-start d-md-flex align-items-center' style={{ columnGap: "16px"}}>
              <div className='icon' onClick={handleClick} style={{ cursor: "pointer" }}>
                <Image 
                  src={`${iconUrl}/cloud-upload.svg`}
                  width={30}
                  height={22}
                  alt='Upload Badge'
                />
              </div>
              <div>
                {selectedFile ? (
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
                )}
                
                <div className='info-text'>(Optional)</div>
              </div>
            </div>
            <Button label='Upload Badge' className='golden' onClick={uploadFile} />
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
    </Container>
  );
};

export default CardSelector;
