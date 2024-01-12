import React, { useState } from 'react';
import Image from 'next/image';
import {Form, Row, Col, Card} from 'react-bootstrap';
import Button from '../../shared/button/button';

const DocumentsValid = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };


    return (
        <Row className="justify-content-center mt-5 verify-documents">      
            <h1 className='title text-center'>Your Certificate is Verified and is Valid.</h1>

            <Col md={{ span: 8 }}>
                <Card className='p-4'>
                    <div className='badge-banner'>
                        <Image 
                            src="/backgrounds/valid-documents.svg"
                            layout='fill'
                            objectFit='contain'
                        />
                    </div>
                    <Form >
                        <div className='d-flex justify-content-center align-items-center'>
                            {/* Custom button */}
                            <label htmlFor="fileInput" className="golden-upload">
                                Upload Certificate
                            </label>

                            {/* File input with an event listener to update the label */}
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            {/* Display the selected file name */}
                            {/* <span className="file-label">
                                {selectedFile ? selectedFile.name : ''}
                            </span> */}
                        </div>
                        <div className='information text-center'>
                            Only <strong>PDF</strong> is supported. <br/> (Upto 2 MB)
                        </div>
                    </Form >
                </Card>
            </Col>
        </Row>
    );
}

export default DocumentsValid;
