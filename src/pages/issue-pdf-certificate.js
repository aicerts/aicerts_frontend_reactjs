import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssueNewCertificate = () => {
    const [message, setMessage] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        certificateNumber: '',
        name: '',
        course: '',
        grantDate: null, // Use null for Date values
        expirationDate: null, // Use null for Date values
        file: null,
    });

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (storedUser && storedUser.JWTToken) {
          // If token is available, set it in the state
          setToken(storedUser.JWTToken);
          setEmail(storedUser.email)
        } else {
          // If token is not available, redirect to the login page
          router.push('/');
        }
      }, []);

      // Function to check if there are any errors
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
        setIsLoading(true);
        setSuccessMessage("")
        setErrorMessage("")

        // Check for errors before making the API request
    
        try {
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
                // setMessage('Success');

                const blob = await response.blob();
                setPdfBlob(blob);
setSuccessMessage("Certificate Successfully Generated")
                setShow(true);
                // Trigger the download
                // Optionally, download the PDF (remove window.open if you only want it to open)
                const link = document.createElement('a');
                link.href = url;
                link.download = 'certificate.pdf';
                link.click();
                URL.revokeObjectURL(url); // Revoke after download or opening

                
            } else if (response) {
                const responseBody = await response.json(); // Assuming the response is in JSON format
                const errorMessage = responseBody && responseBody.message ? responseBody.message : 'An error occurred';
                console.error('API Error:' || 'An error occurred');
                setErrorMessage(errorMessage);
                setShow(true);
                // Handle error (e.g., show an error message)
            } else {
                console.error('No response received from the server.');
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
        // Check if PDF blob is available
        if (pdfBlob) {
            // Create a Blob URL for the PDF blob
            const url = URL.createObjectURL(pdfBlob);

            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'certificate.pdf';
            link.click();

            // Revoke the Object URL to free up resources
            URL.revokeObjectURL(url);
        }
    };


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     console.log('Name:', name, 'Value:', value);

    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [name]: value,
    //     }));
    // };

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
    
        // Check if the input matches the provided regex
        const isFormatValid = regex?.test(value);
    
        // Check if the input length is within the specified range
        const isLengthValid = value.length >= minLength && value.length <= maxLength;
    
        if (isFormatValid && isLengthValid) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
    
            // Clear error message when input is valid
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        } else {
            // If validation fails, update the error state with specific messages
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
                <h2 className='title'>Issue New Certificate</h2>

                <Form className='register-form' onSubmit={handleSubmit} encType="multipart/form-data">
                    <Card>
                        <Card.Body>
                            <Card.Title>Certificate Details</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">

                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                       
                                        <Form.Group controlId="name" className='mb-3'>
                                            <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='name'
                                                value={formData.name}
                                                onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/,3, 20, 'Name')}
                                                required
                                            />
                                             <div style={{color:"red"}} className="error-message">{errors.name}</div>
                                        </Form.Group>
                                        <Form.Group controlId="certificateNumber" className='mb-3'>
                                            <Form.Label>Certificate Number <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='certificateNumber'
                                                value={formData.certificateNumber}
                                                onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12,20, 'Certificate Number')}
                                                required
                                            />
                                            <div style={{color:"red"}} className="error-message">{errors.certificateNumber}</div>
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
                                                onChange={(e) => handleChange(e, /^[^\s]+(\s[^\s]+)*$/,3, 20, 'Course')}
                                                required
                                            />
                                            <div style={{color:"red"}} className="error-message">{errors.course}</div>
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

                                        
                                         {/* <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name='email'
                                                value={formData.email}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </Form.Group> */}
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
                                            <Form.Control type="file" onChange={handleFileChange} />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col md={{ span: 8 }} xs={{ span: 12 }}>
                                        <Button label="Upload" onClick={handleUpload} className="upload" />
                                    </Col> */}
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center d-block d-md-flex justify-content-center' style={{columnGap: '40px'}}>
                        <Button type="submit" label="Issue Certificate" className="golden" />

                        {pdfBlob && (
                            <Button onClick={handleDownload} label="Download Certificate" className="golden" />
                        )}
                    </div>
                    {/* <div className='text-center'>
                        {message && (
                            <p className='mt-3 mb-0 text-danger'>
                                {message}
                            </p>
                        )}
                    </div> */}
                </Form>
            </div>

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
                        ): (
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