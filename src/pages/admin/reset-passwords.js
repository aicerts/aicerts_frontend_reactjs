import React, { useState } from 'react';
import Image from 'next/image';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../../shared/button/button';
import Link from 'next/link'

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.status === 'SUCCESS') {
        console.log('Message: ', data.message);
        // Add any additional logic after successful password reset (e.g., redirect)
      } else if (response.status === 400) {
        console.log('Message: ', data.message);
      } else {
        console.error('Password reset failed:', data.message);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
    }
  };

  const loginPage = () => {
    window.location.href = '/admin/';
  }

  return (
    <div className="forgot-password">
      <div className="container-fluid">
        <Row>
          <Col md={{ span: 7 }} className="d-none d-md-block">
            <div className="badge-banner">
              <Image
                src="/backgrounds/forgot-pass-bg.svg"
                layout="fill"
                objectFit="contain"
                alt="Badge image"
              />
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 5 }}>
            <h1 className="title">Reset Password</h1>
            <Form className="input-elements" onSubmit={handleResetPassword}>
              <Form.Group controlId="email">
                <Form.Label>Enter Your Registered Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className='mt-4'>
                <Form.Label>Enter New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  type="submit" // Specify the type as "submit"
                  label="Reset Password"
                  className="golden"
                />
              </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <Button label="Login" onClick={loginPage} className="outlined" />
                </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResetPassword;
