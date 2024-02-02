import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../../shared/button/button';
import { Form, Row, Col, Card } from 'react-bootstrap';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssueNewCertificate = () => {
    const [message, setMessage] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null, // Use null for Date values
        expirationDate: null, // Use null for Date values
        file: null,
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        // setIsLoading(true);
    
        try {
          const formDataWithFile = new FormData();
          formDataWithFile.append('email', formData.email);
          formDataWithFile.append('certificateNumber', formData.certificateNumber);
          formDataWithFile.append('name', formData.name);
          formDataWithFile.append('course', formData.course);
          formDataWithFile.append('grantDate', "3-2-24");
          formDataWithFile.append('expirationDate', "15-2-24");
          formDataWithFile.append('file', formData.file);
    
          const response = await fetch(`${apiUrl}/api/issue-pdf/`, {
            method: 'POST',
            body: formDataWithFile,
          });
          const responseData = await response.json();

          console.log("Response: ", response)
    
          if (response && response.ok) {
            setMessage(responseData.message || 'Success');
            const blob = await response.blob();
            console.log("Blob: ", blob)
            setPdfBlob(blob);
        } else if (response) {
            console.error('API Error:', responseData.message || 'An error occurred');
            setMessage(responseData.message || 'An error occurred');
            // Handle error (e.g., show an error message)
        } else {
            console.error('No response received from the server.');
        }
        } catch (error) {
          console.error('Error during API request:', error);
        } 
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Name:', name, 'Value:', value);
      
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };

      const handleDateChange = (name, date) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: date,
        }));
      };
    
    
      const handleFileChange = (e) => {
        setFormData({
          ...formData,
          file: e.target.files[0],
        });
      };

    return (
        <div className='register issue-new-certificate'>
            <div className='container'>
                <h2 className='title'>Issue New Certificate</h2>

                <Form className='register-form' onSubmit={handleSubmit} encType="multipart/form-data">
                    <Card>
                        <Card.Body>
                            <Card.Title>Certificate Details</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                name='email'
                                                value={formData.email}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="name" className='mb-3'>
                                            <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name='name'
                                                value={formData.name} 
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="date-of-issue" className='mb-3'>
                                            <Form.Label>Date of Issue <span className='text-danger'>*</span></Form.Label>
                                            <DatePicker
                                                name='date-of-issue'
                                                className='form-control'
                                                dateFormat="MMMM d, yyyy"
                                                // dateFormat="dd-mm-yy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                selected={formData.grantDate} // Use "selected" prop
                                                onChange={(date) => handleDateChange('grantDate', date)} // Handle change
                                                required
                                                isClearable // Add this prop
                                            />
                                        </Form.Group>                                        

                                        <Form.Group controlId="course" className='mb-3'>
                                            <Form.Label>Course Name <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name='course'
                                                value={formData.course} 
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="date-of-expiry" className='mb-3'>
                                            <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                            <DatePicker
                                                name="date-of-expiry"
                                                className='form-control'
                                                // dateFormat="dd-mm-yy"
                                                dateFormat="MMMM d, yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                selected={formData.expirationDate} // Use "selected" prop
                                                onChange={(date) => handleDateChange('expirationDate', date)} // Handle change required
                                                isClearable // Add this prop
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="certificateNumber" className='mb-3'>
                                            <Form.Label>Certificate Number <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name='certificateNumber'
                                                value={formData.certificateNumber} 
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Upload Template  <span className='text-danger'>*</span></Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="formFile">
                                            <Form.Control type="file"onChange={handleFileChange} />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col md={{ span: 8 }} xs={{ span: 12 }}>
                                        <Button label="Upload" onClick={handleUpload} className="upload" />
                                    </Col> */}
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center'>
                        <Button type="submit" label="Issue Certificate" className="golden" />
                        {message && (
                            <p className='mt-3 mb-0'>
                                {message}
                            </p>
                        )}
                        {pdfBlob && (
                            <a
                                href={URL.createObjectURL(pdfBlob)}
                                download="certificate.pdf"
                                target="_blank"  // Opens the link in a new tab/window
                                rel="noopener noreferrer"
                            >
                                Download Certificate
                            </a>
                        )}
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default IssueNewCertificate;