import React, { useState, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';

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
    const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
    const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;

    return (
        <Container className='dashboard pb-5'>
        <Row>
          <h3 className='page-title'>Batch Issuance</h3>
          <Col xs={12} md={4}>
            <Card className='p-0'>
              <Card.Header>Selected Template</Card.Header>
              <Card.Body>
                <img className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />  
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={8}>
            <div className='bulk-upload'>
              <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
                <div className='tagline mb-3 mb-md-0'>Please refer to our sample file for batch upload.</div>
                <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative'/>
              </div>
              <div className='browse-file text-center'>
                <div className='download-icon position-relative'>
                  <Image
                    src="/icons/cloud-upload.svg"
                    layout='fill'
                    objectFit='contain'
                    alt='Upload icon'
                  />
                </div>
                <h4 className='tagline'>Upload  your batch issue certificate file here.</h4>
                
                <div className='restriction-text'>Only <strong>XLSX</strong> is supported. <br/>(Upto 2 MB)</div>
              </div>
              <div className='text-center'>
                <Button label="Next" className='golden btn-next' />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
}

export default DownloadCertificate;
