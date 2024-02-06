import React from 'react';
import Image from 'next/image';
import { Row, Col, Card, Button } from 'react-bootstrap';

const IssuedCertificate = ({ certificateData }) => {
  if (!certificateData || !certificateData.details) {
    // If certificateData is null or does not have details, return null or display an error message
    return <p>Error: Certificate data not available.</p>;
  }
  
  const { details } = certificateData;

  console.log("Date format: ", new Date(details.expirationDate).toLocaleDateString('en-GB'))

  return (
    <div className='container-fluid'>
            <Row className="justify-content-center mt-4 verify-documents">
                <h1 className='title text-center'>{certificateData.message}</h1>
                <Col xs={{ span: 12 }} md={{ span: 10 }}>
                    <Card className='p-0 p-md-4'>
                        <Row className='justify-content-center'>
                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                <Card className='valid-cerficate-info'>
                                    <Card className='dark-card position-relative'>
                                        <div className='d-block d-md-flex justify-content-between align-items-center certificate-internal-info'>
                                            <div className='badge-banner'>
                                                <Image
                                                    src="/backgrounds/varified-certificate-badge.gif"
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt='Badge Banner'
                                                />
                                            </div>
                                            <div className='hash-info'>
                                                <Row className='position-relative'>
                                                    <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                        <div className='hash-title'>Certification Number</div>
                                                        <div className='hash-info'>{details.certificateNumber}</div>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} md={{ span: 6 }}>

                                                        <div className='hash-title'>Certification Name</div>
                                                        <div className='hash-info'>{details.course}</div>
                                                    </Col>
                                                    <hr />
                                                    <hr className='vertical-line' />
                                                    <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                        <div className='hash-title'>Transaction Hash</div>
                                                        <div className='hash-info'>{details.transactionHash}</div>
                                                    </Col>
                                                    <Col xs={{ span: 12 }} md={{ span: 6 }}>
                                                        <div className='hash-title'>Certification Hash</div>
                                                        <div className='hash-info'>{details.certificateHash}</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className='cerficate-external-info d-block d-md-flex justify-content-between align-items-center text-md-left text-center mb-md-0 mb-4  '>
                                        <div className='details'>
                                            <div className='heading'>Name</div>
                                            <div className='heading-info'>{details.name}</div>
                                        </div>
                                        <div className='details'>
                                            <div className='heading'>Grant Date</div>
                                            <div className='heading-info'>{new Date(details.grantDate).toLocaleDateString('en-GB')}</div>
                                        </div>
                                        <div className='details'>
                                            <div className='heading'>Expiration Date</div>
                                            <div className='heading-info'>{new Date(details.expirationDate).toLocaleDateString('en-GB')}</div>
                                        </div>
                                        <div className='details varification-info'>
                                            <Button href={certificateData.polygonLink} target="_blank" className='heading-info' variant="primary">
                                                Verify on Blockchain
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                                {/* <Form className='p-4 p-md-0'>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <label htmlFor="fileInput" className="golden-upload">
                                            Validate Another
                                        </label>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </Form > */}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
  );
};

export default IssuedCertificate;