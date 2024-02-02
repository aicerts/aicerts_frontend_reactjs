import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import DocumentsValid from '../../src/pages/documents-valid';
import Image from 'next/image';

const UploadCertificate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [progress, setProgress] = useState(0);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;


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

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);

                const response = await fetch(`${apiUrl}/api/verify`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json(); // Assuming response is in JSON format
                setApiData(responseData);

            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {apiData ? (
                <>
                    <DocumentsValid handleFileChange={handleFileChange} apiData={apiData} isLoading={isLoading} />
                </>
            ) : (
                <div className='container-fluid'>
                    <Row className="justify-content-center mt-4 verify-documents">
                        <h1 className='title text-center'>Please upload your certification to validate.</h1>
                        <Col md={{ span: 10 }}>
                            <Card className='p-4'>

                                <div className='badge-banner'>
                                    <Image
                                        src="/backgrounds/verify-documents.svg"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Badge banner'
                                    />
                                </div>
                                <Form >
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <label htmlFor="fileInput" className="golden-upload">
                                            Upload Certificate
                                        </label>

                                        {/* File input with an event listener to update the label */}
                                        <input
                                            type="file"
                                            id="fileInput"
                                            style={{ display: 'none' }}
                                            // accept="application/pdf"
                                            onChange={handleFileChange}
                                        />

                                    </div>
                                    <div className='information text-center'>
                                        Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                    </div>
                                </Form >
                            </Card>
                        </Col>
                    </Row>

                    {/* Modal for loading */}
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
                            <ProgressBar now={progress}  />
                        </Modal.Body>
                    </Modal>
                </div>
            )}

        </>
    );
};

export default UploadCertificate;