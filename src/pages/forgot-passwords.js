import React from 'react';
import Image from 'next/image';
import {Form, Row, Col} from 'react-bootstrap';
import Button from '../../shared/button/button';

const ForgotPassword = () => {

    const handleClick = () => {
        // window.location.href = '/';
        alert("Send recovery link")
    };

    const handleClickCancel = () => {
        // window.location.href = '/';
        alert("Cancel")
    };
    
    return (
        <div className='forgot-password'>
            <div className='container-fluid'>
                <Row>
                    <Col md={{ span: 7 }} className='d-none d-md-block'>
                        <div className='badge-banner'>
                            <Image 
                                src="/backgrounds/forgot-pass-bg.svg"
                                layout='fill'
                                objectFit='contain'
                                alt='Badge image'
                            />
                        </div>
                    </Col>
                    <Col xs={{ span: 12 }} md={{ span: 5 }}>
                        <h1 className='title'>Forgot Password?</h1>
                        <Form className='input-elements'>
                            <Form.Group controlId="email">
                                <Form.Label>
                                    Enter Your Registered Email
                                </Form.Label>
                                <Form.Control type="email" />
                            </Form.Group>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Button label="Send Recovery Link" onClick={handleClick} className="golden" />
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Button label="Cancel" onClick={handleClickCancel} className="outlined" />
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ForgotPassword;
