import Image from 'next/image';
import Button from '../../shared/button/button';
import React, { useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import CopyrightNotice from '../app/CopyrightNotice';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setLoginStatus(''); // Clear login status when email changes
        setFormData((prevData) => ({ ...prevData, email: value }));
    };    

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setLoginStatus(''); // Clear login status when password changes
        if (value.length < 8) {
            setPasswordError('Password should be minimum 8 characters');
        } else {
            setPasswordError('');
        }
        setFormData((prevData) => ({ ...prevData, password: value }));
    };

    const login = async () => {
        try {
          // const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
          const apiUrl = "http://localhost:8000";
          const response = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const responseData = await response.json();
    
          if (response.status === 200) {
            // Successful login, handle accordingly (redirect or show a success message)
            if (responseData.status === 'FAILED') {
                // Display error message for failed login
                setLoginStatus('FAILED');
                setLoginError(responseData.message || 'An error occurred during login');
            } else if (responseData.status === 'SUCCESS') {
                // Successful login, redirect to /verify-documents
                localStorage.setItem('user',JSON.stringify(responseData?.data))
                router.push('/verify-documents');
            }
          } else if (response.status === 400) {
            // Invalid input or empty credentials
            setLoginError('Invalid input or empty credentials');
          } else if (response.status === 401) {
            // Invalid credentials entered
            setLoginError('Invalid credentials entered');
          } else {
            // An error occurred during login
            setLoginError('An error occurred during login');
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setLoginError('Please enter valid login credentials');
            return;
        }
    
        if (passwordError) {
            console.error('Login failed: Password is too short');
            return;
        }
    
        // if (passwordError) {
        //   console.error('Login failed: Password is too short');
        //   return;
        // }
    
        await login();
    };


        return (
            <div>
                <Row className="justify-content-md-center mt-5">
                    <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container'>
                        <div className='golden-border-left'></div>
                        <Card className='login input-elements'>
                            <h2 className='title text-center'>Issuer Login</h2>
                            <p className='sub-text text-center'>Login using your credentials.</p>
                            <Form className='login-form' onSubmit={handleSubmit}>
                                <Form.Group controlId="email" className='mb-3'>
                                    <Form.Label>
                                        <Image
                                            src="/icons/user-icon.svg"
                                            width={16}
                                            height={20}
                                            alt='User Name'
                                        />
                                        Email address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleEmailChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>
                                        <Image
                                            src="/icons/lock-icon.svg"
                                            width={20}
                                            height={20}
                                            alt='Password'
                                        />
                                        Password
                                    </Form.Label>
                                    <Form.Control type="password"
                                        required
                                        value={formData.password}
                                        onChange={handlePasswordChange}
                                    />
                                    {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                                </Form.Group>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Button label="Login" className="golden" />
                                    <Link className="forgot-password-text" href="/forgot-passwords">Forgot Password?</Link>
                                </div>
                            </Form>
                            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        </Card>
                        <div className='golden-border-right'></div>
                    </Col>
                    <Col md={{ span: 12 }}>
                        <div className='copy-right text-center'>
                            <CopyrightNotice />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    export default Login;
