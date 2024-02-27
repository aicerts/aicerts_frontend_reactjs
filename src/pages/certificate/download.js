import React, { useState, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Form, Table } from 'react-bootstrap';
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
        <Container className='dashboard pb-5 pt-5'>
          <Row>
            <Col xs={12} md={4}>
              <h3 className='page-title mt-0'>Batch Issuance</h3>
              <Card className='p-0'>
                <Card.Header>Selected Template</Card.Header>
                <Card.Body>
                  <div className='issued-info'>
                    <div className='label'>No. of certificates to be issued</div>
                    <div className='detail'>20</div>
                    <div className='label'>Organisation</div>
                    <div className='detail'>AI CERTs</div>
                    <div className='label'>Issuer</div>
                    <div className='detail'>John Doe</div>
                    <div className='label'>Email</div>
                    <div className='detail'>johndoe@sample.com</div>
                    <div className='label'>Selected Template</div>
                    <img className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />  
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <div className='list-view'>
                <div className="search-wrapper d-flex">
                  <Form.Group controlId="search" className='w-100'>
                    <div className="password-input position-relative">
                      <div>
                        <Form.Control 
                            type='text'
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
                    </div>
                  </Form.Group>
                  <Button label='Download Certificate' className='golden-download w-50' />
                </div>
                <Table striped>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Issuer Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td colSpan={2}>Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
    );
}

export default DownloadCertificate;
