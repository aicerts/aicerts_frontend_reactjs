import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import CertificateTemplateThree from '../components/certificate3';
import { useRouter } from 'next/router';
import moment from 'moment';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
const adminUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;


const IssueCertificate = () => {
    const router = useRouter();
    const [issuedCertificate, setIssuedCertificate] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errors, setErrors] = useState({
        certificateNumber: '',
        name: '',
        course: '',
    });

    const [formData, setFormData] = useState({
        email: "",
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
            setEmail(storedUser.email)
            // Set formData.email with stored email
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: storedUser.email,
            }));

        } else {
            // If token is not available, redirect to the login page
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasErrors = () => {
        const errorFields = Object.values(errors);
        return errorFields.some((error) => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasErrors()) {
            // If there are errors, display them and stop the submission
            setShow(false);
            setIsLoading(false);
            return;
        }

        // Check if the issued date is smaller than the expiry date
        if (formData.grantDate >= formData.expirationDate) {
            setMessage('Issued date must be smaller than expiry date');
            setShow(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        // Format grantDate and expirationDate
        const formattedGrantDate = formData?.grantDate;
        const formattedExpirationDate = formData?.expirationDate;

        try {
            const response = await fetch(`${adminUrl}/api/issue/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    certificateNumber: formData.certificateNumber,
                    name: formData.name,
                    course: formData.course,
                    grantDate: formattedGrantDate,
                    expirationDate: formattedExpirationDate,
                }),
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
            setMessage('An error occurred');
            // console.error('Error during API request:', error);
            setShow(true)
        } finally {
            setIsLoading(false)
        }
    };

    const handleChange = (e, regex, minLength, maxLength, fieldName) => {
        const { name, value } = e.target;

        // Check if the change is for the "name" field
        if (name === 'name') {
            // If the value is empty, allow update
            if (value === '') {
                setFormData({ ...formData, [name]: value });
                return;
            }
    
            // If the value is not empty and starts with a space, disallow update
            if (value.trimStart() !== value) {
                return;
            }
    
            // Validation for disallowing special characters using regex
            if (!regex.test(value)) {
                return; // Do nothing if the value contains special characters
            }

            // Validation for disallowing numbers
            if (/\d/.test(value)) {
                return; // Do nothing if the value contains numbers
            }
    
            // Other validations such as length checks
            if (value.length < minLength || value.length > maxLength) {
                return; // Do nothing if the length is not within the specified range
            }
        }

        // Check if the value is empty
        if (value.trim() === '') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            // Clear error message for this field
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
            return;
        }
        const isFormatValid = regex?.test(value);
        const isLengthValid = value.length >= minLength && value.length <= maxLength;

        if (isFormatValid && isLengthValid) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: isFormatValid
                    ? name === 'certificateNumber' && !isLengthValid
                        ? `Input length must be between ${minLength} and ${maxLength} characters`
                        : ''
                    : name === 'certificateNumber'
                        ? 'Certificate Number must be alphanumeric'
                        : `Input length must be between ${minLength} and ${maxLength} characters`,
            }));


        }
    };

    const handleDateChange = (name, value) => {

        // Parse the input date string as a Date object
        const parsedDate = new Date(value);
        // Extract the components of the date (month, day, year)
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const year = parsedDate.getFullYear();

        // Format the date as mm/dd/yyyy
        const formattedDate = `${month}/${day}/${year}`;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: formattedDate,
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
                    <h2 className='title'>Issue New Certification</h2>

                    <Form className='register-form' onSubmit={handleSubmit} encType="multipart/form-data">
                        <Card>
                            <Card.Body>
                                <Card.Title>Certification Details</Card.Title>

                                <div className='input-elements'>
                                    <Row className="justify-content-md-center">

                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                            <Form.Group controlId="name" className='mb-3'>
                                                <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        name='name'
                                                        value={formData.name}
                                                        onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/, 1, 30, 'Name')}
                                                        required
                                                        maxLength={30} // Limit the input to 30 characters
                                                    />
                                                    <InputGroup.Text>{formData.name.length}/30</InputGroup.Text> {/* Display character count */}
                                                </InputGroup>
                                                <div style={{ color: "red" }} className="error-message">{errors.name}</div>
                                            </Form.Group>

                                            <Form.Group controlId="date-of-issue" className='mb-3'>
                                                <Form.Label>Date of Issue <span className='text-danger'>*</span></Form.Label>
                                                <input
                                                    name='date-of-issue'
                                                    type='date'
                                                    className='form-control'
                                                    selected={formData.grantDate}
                                                    onChange={(e) => handleDateChange('grantDate', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    max={formData.expirationDate || '2099-12-31'} // Maximum date is either expirationDate or 2099-12-31
                                                    required
                                                    isClearable
                                                />

                                            </Form.Group>
                                        </Col>
                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                            <Form.Group controlId="certificateNumber" className='mb-3'>
                                                <Form.Label>Certification Number <span className='text-danger'>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name='certificateNumber'
                                                    value={formData.certificateNumber}
                                                    onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12, 20, 'Certificate Number')}
                                                    required
                                                />
                                                <div style={{ marginTop: "7px" }} className="error-message small-p">{errors.certificateNumber}</div>
                                            </Form.Group>
                                            <Form.Group controlId="date-of-expiry" className='mb-3'>
                                                <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                                <input
                                                    name='date-of-expiry'
                                                    type='date'
                                                    className='form-control'
                                                    selected={formData.expirationDate}
                                                    onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                                                    min={formData.grantDate || new Date().toISOString().split('T')[0]} // Minimum date is either grantDate or today
                                                    max={'2049-12-31'}
                                                    isClearable
                                                />
                                            </Form.Group>


                                        </Col>
                                        <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                            <Form.Group controlId="course" className='mb-3'>
                                                <Form.Label>Course Name <span className='text-danger'>*</span></Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        name='course'
                                                        value={formData.course}
                                                        onChange={(e) => handleChange(e, /^[^\s]+(\s[^\s]+)*$/, 0, 20, 'Course')}
                                                        required
                                                        maxLength={20} // Limit the input to 20 characters
                                                    />
                                                    <InputGroup.Text>{formData.course.length}/20</InputGroup.Text> {/* Display character count */}
                                                </InputGroup>
                                                <div style={{ color: "#ff5500" }} className="error-message">{errors.course}</div>
                                            </Form.Group>

                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className='text-center'>
                            <Button type="submit" label="Issue Certification" className="golden"
                                disabled={
                                    !formData.name ||
                                    !formData.grantDate ||
                                    !formData.certificateNumber ||
                                    !formData.expirationDate ||
                                    !formData.course
                                }
                            />
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