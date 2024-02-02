import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';


const DocumentsValid = ({ handleFileChange, apiData, isLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            // Simulate progress with a timer
            const interval = setInterval(() => {
                // Update the progress (you can replace this with your API logic)
                setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 10 : 100));
            }, 500);

            // Clean up the interval when the component unmounts or loading is complete
            return () => clearInterval(interval);
        } else {
            // Reset the progress when loading is complete
            setProgress(0);
        }
    }, [isLoading]);

    if (!apiData) {
        return (
            <></>
        );
    }

    const { message, detailsQR } = apiData;

    return (
        <div className='container-fluid'>
            <Row className="justify-content-center mt-4 verify-documents">
                <h1 className='title text-center'>{message}</h1>
                <Col xs={{ span: 12 }} md={{ span: 10 }}>
                    <Card className='p-0 p-md-4'>
                        <Row className='justify-content-center'>
                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                {detailsQR ? (
                                    <>
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
                                                                <div className='hash-info'>{detailsQR['Certificate Number']}</div>
                                                            </Col>
                                                            <Col xs={{ span: 12 }} md={{ span: 6 }}>

                                                                <div className='hash-title'>Certification Name</div>
                                                                <div className='hash-info'>{detailsQR['Course Name']}</div>
                                                            </Col>
                                                            <hr />
                                                            <hr className='vertical-line' />
                                                            <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                                <div className='hash-title'>Transaction Hash</div>
                                                                <div className='hash-info'>{detailsQR['Transaction Hash']}</div>
                                                            </Col>
                                                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                                                                <div className='hash-title'>Certification Hash</div>
                                                                <div className='hash-info'>{detailsQR['Certificate Hash']}</div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Card>

                                            <div className='cerficate-external-info d-block d-md-flex justify-content-between align-items-center text-md-left text-center mb-md-0 mb-4  '>
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
                                                    {/* <a href={detailsQR['Polygon URL']} target="_blank" className='heading-info'>Verify on Blockchain</a> */}
                                                    <Button href={detailsQR['Polygon URL']} target="_blank" className='heading-info' variant="primary">
                                                        Verify on Blockchain
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                        <Form className='p-4 p-md-0'>
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
                                                src="/backgrounds/invalid-certificate.gif"
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
                                            <div className='information text-center pb-md-0 pb-4'>
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

            {/* Loading Modal for API call */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/certification-loader.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <ProgressBar now={progress} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DocumentsValid;