import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card } from 'react-bootstrap';

const IssueNewCertificate = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedIssueDate, setSelectedIsseDate] = useState(null);
    const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);

    // File Upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    // Handle File upload onclick
    const handleUpload = () => {
        // Implement your file upload logic here
        if (selectedFile) {
            console.log('Uploading file:', selectedFile);
            // You can use libraries like axios to send the file to a server
        } else {
            console.log('No file selected');
        }
    };

    // Button Click Event
    const handleClick = () => {
        // window.location.href = '/';
        alert("Upload Files")
    };

    // Datepicker for Issue date
    const handleIssueDateChange = (date) => {
        setSelectedIsseDate(date);
    };

    // Datepicker for Expiry date
    const handleExpiryDateChange = (date) => {
        setSelectedExpiryDate(date);
    };

    return (
        <div className='register issue-new-certificate'>
            <div className='container'>
                <h2 className='title'>Issue New Certificate</h2>

                <Form className='register-form'>
                    <Card>
                        <Card.Body>
                            <Card.Title>Certificate Details</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="name-of-candidate" className='mb-3'>
                                            <Form.Label>Name of Candidate</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="certificate-number" className='mb-3'>
                                            <Form.Label>Certificate Number</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="date-of-issue" className='mb-3'>
                                            <Form.Label>Date of Issue</Form.Label>
                                            <DatePicker
                                                className='form-control'
                                                selected={selectedIssueDate}
                                                onChange={handleIssueDateChange}
                                                dateFormat="MMMM d, yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </Form.Group>
                                        

                                        <Form.Group controlId="course-name" className='mb-3'>
                                            <Form.Label>Course Name</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="date-of-expiry" className='mb-3'>
                                            <Form.Label>Date of Expiry</Form.Label>
                                            <DatePicker
                                                className='form-control'
                                                selected={selectedExpiryDate}
                                                onChange={handleExpiryDateChange}
                                                dateFormat="MMMM d, yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Upload Template</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="formFile">
                                            <Form.Control type="file" onChange={handleFileChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 8 }} xs={{ span: 12 }}>
                                        <Button label="Upload" onClick={handleUpload} className="upload" />
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center'>
                        <Button label="Submit" onClick={handleClick} className="golden" />
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default IssueNewCertificate;