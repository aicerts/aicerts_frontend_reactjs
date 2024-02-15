// Import necessary modules and components
import React, { useState } from 'react';
import Image from 'next/image';
import { Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../shared/button/button';
import user, { changePassword } from '../services/userServices'; // Update the import based on your actual file structure
import ShowMessage from '../components/showMessage';
import { useRouter } from 'next/router';

// Component definition
const PasswordsConfirm = () => {
  // Initialize React Router
  const router = useRouter();

  // State variables for password, confirm password, show password toggle, errors, and success message
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ message: '' });
  const [successMessage, setSuccessMessage] = useState('');

  // Function to toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      setErrors({ message: '' });

      // Check if fields are filled
      if (!password || !confirmPassword) {
        setErrors({ message: 'Please fill in all the fields!' });
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setErrors({ message: 'Passwords do not match!' });
        return;
      }

      // Check if password is at least 8 characters
      if (password.length < 8) {
        setErrors({ message: 'Password should be 8 characters or longer!' });
        return;
      }

      // Extract email from the URL
      const { email } = router.query;

      // Check if email is available
      if (!email) {
        setErrors({ message: 'Email parameter is missing in the URL!' });
        return;
      }

      // Prepare data for API call
      const data = {
        email: email.toString(), // Convert email to string
        password: password,
      };

      // Call the changePassword API with the form data
      user.changePassword(data, (response) => {
        if (response.data.status === 'SUCCESS') {
          // Successful password update
          setSuccessMessage('Password updated successfully');
          router.push("/")
        } else {
          setErrors({ message: response?.data?.message });
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Function to handle cancellation
  const handleClickCancel = () => {
    // Handle cancellation, e.g., redirect or show a confirmation message
    router.push('/login');
  };

  // Component JSX
  return (
    <div className='forgot-password'>
      <div className='container-fluid'>
        <Row>
          <Col md={{ span: 7 }} className='d-none d-md-block'>
            <div className='badge-banner'>
              <Image
                src='/backgrounds/forgot-pass-bg.svg'
                layout='fill'
                objectFit='contain'
                alt='Badge image'
              />
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 5 }}>
            <h1 className='title'>Password Confirmation</h1>
            <Form className='input-elements'>
              <Form.Group controlId='new-password'>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Eye icon for password visibility toggle */}
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className='eye-icon'
                  onClick={handleTogglePassword}
                />
              </Form.Group>
              <Form.Group controlId='confirm-password'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              {errors.message && <ShowMessage type='error' message={errors.message} />}
              {successMessage && <ShowMessage type='success' message={successMessage} />}
              <div className='d-flex justify-content-between align-items-center'>
                <Button label='Submit' onClick={handleClick} className='golden' />
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <Button label='Cancel' onClick={handleClickCancel} className='outlined' />
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Export the component
export default PasswordsConfirm;
