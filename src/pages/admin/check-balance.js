import Image from 'next/image';
import Button from '../../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import CopyrightNotice from '../../app/CopyrightNotice';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CheckBalance = () => {
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          setIsLoading(true);
    
          const response = await fetch(`${apiUrl}/api/check-balance?address=${address}`);
          const responseData = await response.json();
    
          if (response.ok) {
            setMessage(responseData.message || 'Success');
            setBalance(responseData.balance || '');
          } else {
              throw new Error(responseData.message || 'Failed to fetch balance');
              setBalance('');
          }
        } catch (error) {
          console.error('Error fetching balance:', error.message);
          setMessage(error.message || 'An error occurred while fetching balance');
          setBalance('');
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className='login-page'>
            <div className='container'>
                <Row className="justify-content-md-center">
                    <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container mt-5'>
                        <div className='golden-border-left'></div>
                        <Card className='login input-elements'>
                            <h2 className='title text-center'>Check Balance</h2>
                            <p className='sub-text text-center'></p>
                            <Form className='login-form' onSubmit={handleSubmit}>
                                <Form.Group controlId="email" className='mb-3'>
                                    <Form.Label>
                                        Ethereum account address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Form.Group>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Button type="submit" label="Check Balance" className="golden" />
                                </div>
                            </Form>

                            {message && (
                                <p className={`text-center ${message.toLowerCase().includes('success') ? 'text-success' : 'text-danger'} mt-4 mb-0`}>
                                    <strong>{message}</strong>
                                </p>
                            )}

                            {balance && <h4 className='text-center mt-2 mb-0'>Balance: <strong>{balance}</strong></h4>}
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

export default CheckBalance;