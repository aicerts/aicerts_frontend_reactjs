import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card, Alert } from 'react-bootstrap';
import user from "../services/userServices"
import { isStrongPassword } from '../common/auth';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();
   // State for form data
   const [formData, setFormData] = useState({
    organisationName: '',
    address: '',
    country: '',
    organizationType: '',
    city: '',
    zip: '',
    industrySector: '1', // Default value for the dropdown
    state: '',
    websiteLink: '',
    fullName: '',
    userPhoneNumber: '',
    userDesignation: '',
    userEmail: '',
    username: '',
    designation: '',
    password: '',
    confirmPassword: '',
});

const [fieldErrors, setFieldErrors] = useState({
    organisationName:'',
    fullName:'',
    userEmail:'',
    password: '',
    confirmPassword: '',
    generalError:''

  });

  const [showOtpField, setShowOtpField] = useState(false);
  const [otp,setOtp] = useState("")
  const [otpError, setOtpError] = useState("")


  const [showPassword, setShowPassword] = useState({
    password:false,
    confirmPassword:false
  }); 
  // Function to handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  
    // Clear field error when the user starts typing
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  
    // Check for password strength
    if (field === 'password') {
      const { isValid, errorMessage } = isStrongPassword(value);
  
      if (!isValid) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          password: errorMessage,
        }));
      } else {
        // Clear password error if the password is strong
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          password: '',
        }));
      }
    }
  };

// Function to handle form submission
const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData, "formdata");
  
    // Check for required fields
    const requiredFields = ['fullName', 'password', 'confirmPassword','userEmail','organisationName'];
    const newFieldErrors = {};
  
    // Generate error message with Field Name
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newFieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
  
    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Update field errors state
    setFieldErrors(newFieldErrors);
  
    // Check if there are any errors before making the API call
    if (Object.keys(newFieldErrors).length === 0) {
        const data ={
            name: formData?.fullName,
            email:formData?.userEmail,
            password:formData?.password,
            organization:formData?.organisationName
        
        }
      // Call the register API with the form data
      user?.register(data, (response) => {
        // Handle the API response here (success or error)
console.log(response,"res")
        if (response.data.status === 'SUCCESS') {
          // successful registration
          console.log('Registration successful!', response.data);
          // setShowOtpField(true)
          router.push('/login');
        }else if(response.data.status === 'FAILED') {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            generalError: response?.data?.message,
          }));
        } 
        else {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            generalError: response?.data?.message,
          }));
        } 
      });
    }
  };
  

//handle verify OTP

const handleVerifyOtp=()=>{
  const data = {
    email:formData.userEmail,
    code:otp
  }

   // Call the register API with the form data
   user?.verifyOtp(data, (response) => {
    // Handle the API response here (success or error)
    if (response.data.status === 'PASSED') {
      // successful registration
      console.log('Registration successful!', response.data);
      router.push('/verify-documents');
    }else if(response.data.status === 'FAILED') {
      setOtpError(response.error || "Incorrect OTP")
    } else {
      // Handle registration error
      console.error('Registration failed!', response.error);
      setOtpError("Server Error")
    }
  });
}


    return (
        <div className='register'>
            <div className='container'>
                <h2 className='title'>Register here</h2>

                <Form className='register-form'>
                    <Card>
                        <Card.Body>
                            <Card.Title>Organization Details</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="organization-name" className='mb-3'>
                                            <Form.Label>Organization Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                    
                                                value={formData.organisationName}
                                                onChange={(e) => handleInputChange('organisationName', e.target.value)}
                                                />
                                                 {fieldErrors.organisationName && <p className='error-message' style={{ color: 'red' }}>{fieldErrors.organisationName}</p>}
                                        </Form.Group>

                                        <Form.Group controlId="address" className='mb-3'>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text"
                                            value={formData?.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="country" className='mb-3'>
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control type="text"
                                            value={formData?.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="organization-type" className='mb-3'>
                                            <Form.Label>Organization Type</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.organizationType}
                                            onChange={(e) => handleInputChange('organizationType', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="city" className='mb-3'>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="zip" className='mb-3'>
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.zip}
                                            onChange={(e) => handleInputChange('zip', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Label>Industry Sector</Form.Label>
                                        <Form.Select aria-label="select" className='mb-3' 
                                        value={formData?.industrySector}
                                        onChange={(e) => handleInputChange('industrySector', e.target.value)}
                                        >
                                            <option value="1">Technology</option>
                                            <option value="2">Technology 1</option>
                                            <option value="3">Technology 2</option>
                                        </Form.Select>

                                        <Form.Group controlId="state" className='mb-3'>
                                            <Form.Label>State</Form.Label>
                                            <Form.Control type="text"
                                            value={formData?.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="website-link" className='mb-3'>
                                            <Form.Label>Website Link</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.websiteLink}
                                            onChange={(e) => handleInputChange('websiteLink', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Primary Contact Detail of the User</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="full-name" className='mb-3'>
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            />
                                             {fieldErrors.fullName && <p className='error-message' style={{ color: 'red' }}>{fieldErrors.fullName}</p>}
                                        </Form.Group>
                                        <Form.Group controlId="phone-number" className='mb-3'>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.userPhoneNumber}
                                            onChange={(e) => handleInputChange('userPhoneNumber', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="designation" className='mb-3'>
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control type="text" 
                                            value={formData?.designation}
                                            onChange={(e) => handleInputChange('designation', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" 
                                            value={formData?.userEmail}
                                            onChange={(e) => handleInputChange('userEmail', e.target.value)}
                                            />
                                            {fieldErrors.userEmail && <p className='error-message' style={{ color: 'red' }}>{fieldErrors.userEmail}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Signup Details</Card.Title>

                            <div className='input-elements'>
                                <Row className="justify-content-md-center">
                                <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Form.Group controlId='username' className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Form.Group controlId='password' className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword.password ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <i
                  className={`bi bi-eye${showPassword ? '-slash' : ''}`}
                  onClick={() => setShowPassword((prevShowPassword) => ({ ...prevShowPassword, password: !prevShowPassword?.password }))}

                >
                
                </i>
                {fieldErrors.password && <p className='error-message' style={{ color: 'red' }}>{fieldErrors.password}</p>}

              </Form.Group>
            </Col>
            <Col md={{ span: 4 }} xs={{ span: 12 }}>
              <Form.Group controlId='confirmPassword' className='mb-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <i
                  className={`bi bi-eye${showPassword ? '-slash' : ''}`}
                  onClick={() => setShowPassword((prevShowPassword) => ({ ...prevShowPassword, confirmPassword: !prevShowPassword?.confirmPassword }))}

                ></i>
                {fieldErrors.confirmPassword && (
                  <p  className='error-message' style={{ color: 'red' }}>{fieldErrors.confirmPassword}</p>
                )}
              </Form.Group>
            </Col>
            {fieldErrors.generalError && (
                  <p  className='error-message' style={{ color: 'red' }}>{fieldErrors.generalError}</p>
                )}
{
  showOtpField  && 
  <Col md={{ span: 4 }} xs={{ span: 12 }}>
  <Form.Group controlId='otp' className='mb-3'>
    <Form.Label>Enter OTP</Form.Label>
    <Form.Control
      type='password'
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
     
    
    {otpError ? (
      <p  className='error-message' style={{ color: 'red' }}>{otpError}</p>
    ):
    <p  className='success-message' style={{ color: 'green' }}>OTP has been sent to {formData.userEmail}</p>
    }
  </Form.Group>
</Col>
}
           
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center'>
                       {showOtpField?
                       
                        <Button label="Verify" onClick={handleVerifyOtp} className="golden" />
                       : <Button label="Submit" onClick={handleSubmit} className="golden" />}
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Register;