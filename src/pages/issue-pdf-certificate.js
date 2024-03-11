import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import Image from 'next/image';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssueNewCertificate = () => {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null,
        expirationDate: null,
        file: null,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email)
        } else {
            router.push('/');
        }
    }, []);

    const hasErrors = () => {
        const errorFields = Object.values(errors);
        return errorFields.some((error) => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasErrors()) {
            setShow(false);
            setIsLoading(false);
            return;
        }

        // Check if the issued date is smaller than the expiry date
        if (formData.grantDate >= formData.expirationDate) {
            setErrorMessage('Issued date must be smaller than expiry date');
            setShow(true);
            setIsLoading(false);
            return;
        }


        setIsLoading(true);
        setSuccessMessage("")
        setErrorMessage("")

        try {
            if(!isDownloading) {
            const formDataWithFile = new FormData();
            formDataWithFile.append('email', email);
            formDataWithFile.append('certificateNumber', formData.certificateNumber);
            formDataWithFile.append('name', formData.name);
            formDataWithFile.append('course', formData.course);
            formDataWithFile.append('grantDate', formData.grantDate);
            formDataWithFile.append('expirationDate', formData.expirationDate);
            formDataWithFile.append('file', formData.file);

            const response = await fetch(`${apiUrl}/api/issue-pdf/`, {
                method: 'POST',
                body: formDataWithFile,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response && response.ok) {
                const blob = await response.blob();
                setPdfBlob(blob);
                setSuccessMessage("Certificate Successfully Generated")
                setShow(true);
            } else if (response) {
                const responseBody = await response.json();
                const errorMessage = responseBody && responseBody.message ? responseBody.message : 'An error occurred';
                console.error('API Error:' || 'An error occurred');
                setErrorMessage(errorMessage);
                setShow(true);
            } else {
                console.error('No response received from the server.');
            }
        }
        } catch (error) {
            console.error('Error during API request:', error);
        } finally {
            setIsLoading(false)
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleDownload = () => {
        setIsDownloading(true)
        if (pdfBlob) {
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'certificate.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
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

    const [errors, setErrors] = useState({
        certificateNumber: '',
        name: '',
        course: '',
    });

    const handleChange = (e, regex, minLength, maxLength, fieldName) => {
        const { name, value } = e.target;
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

    return (
        <div className='register issue-new-certificate'>
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
                                            <Form.Control
                                                type="text"
                                                name='name'
                                                value={formData.name}
                                                onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/, 3, 20, 'Name')}
                                                required
                                            />
                                            <div style={{ color: "red" }} className="error-message">{errors.name}</div>
                                        </Form.Group>
                                        <Form.Group controlId="certificateNumber" className='mb-3'>
                                            <Form.Label>Certification Number <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='certificateNumber'
                                                value={formData.certificateNumber}
                                                onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12, 20, 'Certificate Number')}
                                                required
                                            />
                                            <div style={{ color: "red" }} className="error-message">{errors.certificateNumber}</div>
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
                                                selected={formData.grantDate}
                                                onChange={(date) => handleDateChange('grantDate', date)}
                                                required
                                                isClearable
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="course" className='mb-3'>
                                            <Form.Label>Course Name <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='course'
                                                onChange={(e) => handleChange(e, /^[^\s]+(\s[^\s]+)*$/, 3, 20, 'Course')}
                                                required
                                            />
                                            <div style={{ color: "red" }} className="error-message">{errors.course}</div>
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
                                                selected={formData.expirationDate}
                                                onChange={(date) => handleDateChange('expirationDate', date)}
                                                isClearable
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Upload Template  <span className='text-danger'>*</span>
                                <p className='mb-0 mt-2 font-monospace small text-black-50'>PDF dimentions should less than or equal to width: 250 pixel, height: 350 pixel</p>
                            </Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="formFile">
                                            <Form.Control type="file" onChange={handleFileChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center d-block d-md-flex justify-content-center' style={{ columnGap: '40px' }}>
                        <Button type="submit" label="Issue Certification" className="golden" disabled={isLoading} />

                        {pdfBlob && (
                            <Button onClick={handleDownload} label="Download Certification" className="golden" disabled={isLoading} />
                        )}
                    </div>
                </Form>
            </div>

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
                    {errorMessage !== '' ? (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{errorMessage}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    ) : (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: '#198754' }}>{successMessage}</h3>
                            <button className='success' onClick={handleClose}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default IssueNewCertificate;
