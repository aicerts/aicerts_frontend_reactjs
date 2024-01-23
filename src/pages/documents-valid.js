import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';


const DocumentsValid = ({ handleFileChange, apiData, isLoading }) => {
    // const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    if (!apiData) {
        return (
            <></>
        );
    }

    const { message, detailsQR } = apiData;

    return (
        <div className='container-fluid'>
            <Row className="justify-content-center mt-5 verify-documents">
                <h1 className='title text-center'>{message}</h1>
                <Col md={{ span: 10 }}>
                    <Card className='p-4'>
                        <Row className='justify-content-center'>
                            <Col md={{ span: 10 }}>
                                {detailsQR ? (
                                    <>
                                        <Card className='valid-cerficate-info'>
                                            <Card className='dark-card'>
                                                <div className='certificate-name'>Certification Name: {detailsQR['Course Name']}</div>
                                                <div className='d-flex justify-content-between align-content-center certificate-internal-info'>
                                                    <div className='badge-banner'>
                                                        <Image
                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                            layout='fill'
                                                            objectFit='contain'
                                                            alt='Badge Banner'
                                                        />
                                                    </div>
                                                    <div className='hash-info'>
                                                        <div className='hash-title'>Transaction Hash</div>
                                                        <div className='hash-info'>{detailsQR['Transaction Hash']}</div>
                                                        <hr />
                                                        <div className='hash-title'>Certificate Hash</div>
                                                        <div className='hash-info'>{detailsQR['Certificate Hash']}</div>
                                                        <hr />
                                                        <div className='hash-title'>Certificate Number</div>
                                                        <div className='hash-info'>{detailsQR['Certificate Number']}</div>
                                                    </div>
                                                </div>
                                            </Card>
                                            <div className='cerficate-external-info d-flex justify-content-between align-content-center'>
                                                <div className='details'>
                                                    <div className='heading'>Name</div>
                                                    <div className='heading-info'>{detailsQR['Name']}</div>
                                                </div>
                                                <div className='details'>
                                                    <div className='heading'>Grant Date</div>
                                                    <div className='heading-info'>{detailsQR['Grant Date']}</div>
                                                </div>
                                                <div className='details'>
                                                    <div className='heading'>Expiration Date</div>
                                                    <div className='heading-info'>{detailsQR['Expiration Date']}</div>
                                                </div>
                                                <div className='details varification-info'>
                                                    <div className='heading'>&nbsp;</div>
                                                    <a href={detailsQR['Polygon URL']} target="_blank" className='heading-info'>Verify on Blockchain</a>
                                                </div>
                                            </div>
                                        </Card>
                                        <Form >
                                            <div className='d-flex justify-content-center align-items-center'>
                                                {/* Custom button */}
                                                <label htmlFor="fileInput" className="golden-upload">
                                                    Validate Another
                                                </label>

                                                {/* File input with an event listener to update the label */}
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <div className='information text-center'>
                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                            </div>
                                        </Form >
                                    </>
                                ) : (

                                    <>
                                        <div className='badge-banner'>
                                            <Image
                                                src="/backgrounds/invalid-certificate.svg"
                                                layout='fill'
                                                objectFit='contain'
                                                alt='Badge Banner'
                                            />
                                        </div>
                                        <Form >
                                            <div className='d-flex justify-content-center align-items-center'>
                                                {/* Custom button */}
                                                <label htmlFor="fileInput" className="golden-upload">
                                                    Validate again
                                                </label>

                                                {/* File input with an event listener to update the label */}
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <div className='information text-center'>
                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                            </div>
                                        </Form >
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Modal show={isLoading} centered>
                <Modal.Body>
                    <header>
                        <div className="Loader">
                            <div className="text">Verifying Certificate</div>
                            <div className="dots">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </header>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DocumentsValid;
