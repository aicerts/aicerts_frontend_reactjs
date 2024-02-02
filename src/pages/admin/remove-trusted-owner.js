import Image from 'next/image';
import Button from '../../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import CopyrightNotice from '../../app/CopyrightNotice';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const RemoveTrustedOwner = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          setIsLoading(true);
          const response = await fetch(`${apiUrl}/api/remove-trusted-owner`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
          });
      
          const responseData = await response.json();
      
        //   if (!response.ok) {
        //     throw new Error('Failed to add trusted owner');
        //   }

          if (responseData === '200') {
            // Successful signup, handle accordingly (redirect or show a success message)
            setMessage(responseData?.message);
        } else {
            // Handle signup error (show error message or redirect to an error page)
            setMessage(responseData?.message)
        }
      
        //   setMessage(responseData?.message || 'there is an issue');
        } catch (error) {
          console.error('Error adding trusted owner:', error);
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        console.log("Test response: ", message);
      }, [message]);

    return (
        <div className='login-page'>
            <div className='container'>
                <Row className="justify-content-md-center">
                    <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container mt-5'>
                        <div className='golden-border-left'></div>
                        <Card className='login input-elements'>
                            <h2 className='title text-center'>Remove Trusted Owner</h2>
                            <p className='sub-text text-center'></p>
                            <Form className='login-form' onSubmit={handleSubmit}>
                                <Form.Group controlId="text" className='mb-3'>
                                    <Form.Label>
                                    Insert Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Form.Group>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Button label="Submit" className="golden" />
                                </div>
                            </Form>
                            {/* {message && <p className='text-center mt-5'>{message}</p>} */}
                            {message && (
                                <p className={`mt-3 text-center mb-0 ${message.status === '200' ? 'text-success' : 'text-danger'}`}>
                                    {message}
                                </p>
                            )}
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
        </div>
    );
}

export default RemoveTrustedOwner;