import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import { Container,Form, Row, Col, Card, Modal, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import fileDownload from 'react-file-download';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;

const IssueNewCertificate = () => {
    const [pdfBlob, setPdfBlob] = useState(null);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState();
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
        setSuccessMessage("");
        setErrorMessage("");
    
        const formattedGrantDate = formData?.grantDate;
        const formattedExpirationDate = formData?.expirationDate;
    
        try {
            if (!isDownloading) {
                const formDataWithFile = new FormData();
                formDataWithFile.append('email', email);
                formDataWithFile.append('certificateNumber', formData.certificateNumber);
                formDataWithFile.append('name', formData.name);
                formDataWithFile.append('course', formData.course);
                formDataWithFile.append('grantDate', formattedGrantDate);
                formDataWithFile.append('expirationDate', formattedExpirationDate);
                formDataWithFile.append('file', formData.file);
    
                const response = await fetch(`${apiUrl}/api/issue-pdf-image`, {
                    method: 'POST',
                    body: formDataWithFile,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (response && response.ok) {
                    const blob = await response.blob();
  
                    const formCert = new FormData();
                    // Append the PNG blob to the form data
                    formCert.append('file', blob);
                    // Append additional fields
                    formCert.append('certificateNumber', formData.certificateNumber);
                    formCert.append('type', 1);
    
                    // Make the API call to send the form data
                    const uploadResponse = await fetch(`${apiUrl}/api/upload-certificate`, {
                        method: 'POST',
                        body: formCert,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
    
                    if (uploadResponse.ok) {
                        console.log('PDF successfully uploaded');
                        setSuccessMessage("Certificate Successfully Generated");
                        setShow(true);
                        setPdfBlob(pdfBlob);
                    } else {
                        const responseBody = await uploadResponse.json();
                        const errorMessage = responseBody?.message || 'An error occurred';
                        console.error('API Error:', errorMessage);
                        setErrorMessage(errorMessage);
                        setShow(true);
                    }
                }
                } else {
                    const responseBody = await response.json();
                    const errorMessage = responseBody?.message || 'An error occurred';
                    console.error('API Error:', errorMessage);
                    setErrorMessage(errorMessage);
                    setShow(true);
                }
            
        } catch (error) {
            console.error('Error during API request:', error);
            setErrorMessage('An unexpected error occurred');
            setShow(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleClose = () => {
        setShow(false);
    };

    const handleDownload = () => {
        setIsDownloading(true)
        if (pdfBlob) {
            const fileData = new Blob([pdfBlob], { type: 'application/pdf' });
            fileDownload(fileData, 'certificate.pdf');
        }
    };

    const handleDateChange = (name, date) => {
        // Parse the input date string as a Date object
        const parsedDate = new Date(date);
        // Extract the components of the date (month, day, year)
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const year = parsedDate.getFullYear();
    
        // Format the date as mm/dd/yyyy
        const formattedDate = `${month}/${day}/${year}`;
    
        // If the name is 'grantDate', update grantDate and set the minimum date for expiryDate
        if (name === 'grantDate') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: formattedDate,
            }));
        } else {
            // Check if expiryDate is before or equal to grantDate
            const grantDate = new Date(formData.grantDate);
            if (parsedDate <= grantDate) {
                // If expiryDate is before or equal to grantDate, set it to one day after grantDate
                parsedDate.setDate(grantDate.getDate() + 1);
                const newMonth = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const newDay = String(parsedDate.getDate()).padStart(2, '0');
                const newYear = parsedDate.getFullYear();
                const newFormattedDate = `${newMonth}/${newDay}/${newYear}`;
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: newFormattedDate,
                }));
            } else {
                // If expiryDate is after grantDate, update the form data with the formatted expiryDate
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: formattedDate,
                }));
            }
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileType = fileName.split('.').pop(); // Get the file extension
            const fileSize = file.size / 1024; // Convert bytes to KB

            if (
                fileType.toLowerCase() === 'pdf' &&
                fileSize >= 250 &&
                fileSize <= 500
            ) {
                setFormData({
                    ...formData,
                    file: file,
                });
            } else {
                let message = '';
                if (fileType.toLowerCase() !== 'pdf') {
                    message = 'Only PDF files are supported.';
                } else if (fileSize < 250) {
                    message = 'File size should be at least 250KB.';
                } else if (fileSize > 500) {
                    message = 'File size should be less than or equal to 500KB.';
                }
                // Reset the file input field
                e.target.value = null;
                // Notify the user with the appropriate message
                setErrorMessage(message);
                setShow(true);
            }
            setUploadedFile(true)
        } else {
            setUploadedFile(false)
        }
    };



    const [errors, setErrors] = useState({
        certificateNumber: '',
        name: '',
        course: '',
    });

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

        if (name === 'certificateNumber' || name === 'course') {
            // If the value is not empty and starts with a space, disallow update
            if (value.trimStart() !== value) {
                return;
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
    
    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='register issue-new-certificate'>
                        <div className='vertical-center'>
                            <Container>
                                <h2 className='title'>Issue New Certification</h2>
                                <Form className='register-form' onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Certification Details</Card.Title>

                                            <div className='input-elements'>
                                                <Row className="justify-content-md-center">
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="name" className='mb-3'>
                                                            <Form.Label >Name <span className='text-danger'>*</span></Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='name'
                                                                    value={formData.name}
                                                                    onChange={(e) => handleChange(e, /^[a-zA-Z0-9\s]+$/, 0, 30, 'Name')}
                                                                    required
                                                                    maxLength={30} // Limit the input to 30 characters
                                                                />
                                                                <InputGroup.Text>{formData.name.length}/30</InputGroup.Text> {/* Display character count */}
                                                            </InputGroup>
                                                        </Form.Group>
                                                        <Form.Group controlId="certificateNumber" className='mb-3'>
                                                            <Form.Label>Certification Number <span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name='certificateNumber'
                                                                value={formData.certificateNumber}
                                                                onChange={(e) => handleChange(e, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, 12, 20, 'Certificate Number')}
                                                                maxLength={20}
                                                                required
                                                            />
                                                            <div style={{ marginTop: "7px" }} className="error-message small-p">{errors.certificateNumber}</div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="date-of-issue" className='mb-3'>
                                                            <Form.Label>Date of Issue <span className='text-danger'>*</span></Form.Label>
                                                            <input
                                                                name='date-of-issue'
                                                                type='date'
                                                                className='form-control'
                                                                selected={formData.grantDate}
                                                                onChange={(e) => handleDateChange('grantDate', e.target.value)}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                max={formData.expirationDate || '9999-12-31'} // Maximum date is either expirationDate or 2099-12-31
                                                                required
                                                            />
                                                        </Form.Group>

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
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="date-of-expiry" className='mb-3'>
                                                            <Form.Label>Date of Expiry  <span className='text-danger'>*</span></Form.Label>
                                                            <input
                                                                name='date-of-expiry'
                                                                type='date'
                                                                className='form-control'
                                                                selected={formData.expirationDate}
                                                                onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                                                                min={formData.grantDate || new Date().toISOString().split('T')[0]} // Minimum date is either grantDate or today
                                                                max={'9999-12-31'}
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
                                                <p className='mb-0 mt-2 font-monospace small-p text-black-100'>PDF dimensions should less than or equal to width:(340-360)mm and height:(240-260)mm</p>
                                                <p className='mb-0 mt-2 font-monospace small-p text-black-100'>PDF File size should be 250KB - 500KB</p>
                                            </Card.Title>

                                            <div className='input-elements'>
                                                <Row className="justify-content-md-center">
                                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                                        <Form.Group controlId="formFile">
                                                            <Form.Control name="formFile" type="file" onChange={handleFileChange} accept=".pdf" />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <div className='text-center d-block d-md-flex justify-content-center' style={{ columnGap: '40px' }}>
                                        <Button type="submit" label="Issue Certification" className="golden" 
                                            disabled={
                                                !formData.name ||
                                                !formData.certificateNumber ||
                                                !formData.grantDate ||
                                                !formData.course ||
                                                !formData.expirationDate ||
                                                !uploadedFile
                                            } 
                                        />

                                        {pdfBlob && (
                                            <Button onClick={handleDownload} label="Download Certification" className="golden" disabled={isLoading} />
                                        )}
                                    </div>
                                </Form>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>
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
        </>
    );
}

export default IssueNewCertificate;
