// pages/select-certificate.js
import React, { useState, useEffect } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation

const CardSelector = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const router = useRouter(); // Initialize useRouter hook

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
          {selectedCard !== null && (
            <Card className='preview-certificate'>
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
