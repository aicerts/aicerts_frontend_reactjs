import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import Image from 'next/image';
import CertificateTemplateThree from '../components/certificate3';
import { useRouter } from 'next/router';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;


const IssueCertificate = () => {
    const router = useRouter();
    const [issuedCertificate, setIssuedCertificate] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null, // Use null for Date values
        expirationDate: null, // Use null for Date values
    });

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (storedUser && storedUser.JWTToken) {
          // If token is available, set it in the state
          setToken(storedUser.JWTToken);
        } else {
          // If token is not available, redirect to the login page
          router.push('/');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/issue/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();

            if (response && response.ok) {
                setMessage(responseData.message || 'Success');
                setIssuedCertificate(responseData); // Corrected variable name
                // Handle success (e.g., show a success message)
            } else if (response) {
                console.error('API Error:', responseData.message || 'An error occurred');
                setMessage(responseData.message || 'An error occurred');
                setShow(true)
                // Handle error (e.g., show an error message)
            } else {
                setMessage(responseData.message || 'No response received from the server.');
                console.error('No response received from the server.');
                setShow(true)
            }
        } catch (error) {
            setMessage(responseData.error || 'An error occurred');
            // console.error('Error during API request:', error);
            setShow(true)
        } finally {
            setIsLoading(false)
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

    return (
        <div className='register issue-new-certificate'>

            {issuedCertificate ? (
                <>
                    {issuedCertificate && <CertificateTemplateThree certificateData={issuedCertificate} />}
                </>
            ) : (
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
                        <div className='text-center'>
                            <Button type="submit" label="Issue Certificate" className="golden" />
                            {message && (
                                <p className='mt-3 mb-0'>
                                    {message}
                                </p>
                            )}
                        </div>
                    </Form>

                </div>
            )}
            {/* Loading Modal for API call */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                </Modal.Body>
            </Modal>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>
                    {message && 
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}> {message}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default IssueCertificate;