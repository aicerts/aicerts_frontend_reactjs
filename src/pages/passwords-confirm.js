import React, { useState } from 'react';
import Image from 'next/image';
import {Form, Row, Col} from 'react-bootstrap';
import Button from '../../shared/button/button';

const PasswordsConfirm = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const handleClick = () => {
        // window.location.href = '/';
        alert("Submit")
    };

    const handleClickCancel = () => {
        // window.location.href = '/';
        alert("Cancel")
    };
    
    return (
        <div className='forgot-password'>
            <div className='container-fluid'>
                <Row>
                    <Col md={{ span: 7 }}  className='d-none d-md-block'>
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
                        <h1 className='title'>Password Confirmation</h1>
                        <Form className='input-elements'>
                            <Form.Group controlId="new-password">
                                <Form.Label>
                                    New Password
                                </Form.Label>
                                <Form.Control type={showPassword ? 'text' : 'password'} />
                                <button value="show" onClick={handleTogglePassword} /> 
                            </Form.Group>
                            <Form.Group controlId="confirm-password">
                                <Form.Label>
                                    Confirm Password
                                </Form.Label>
                                <Form.Control type={showPassword ? 'text' : 'password'} />
                            </Form.Group>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Button label="Submit" onClick={handleClick} className="golden" />
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

export default PasswordsConfirm;
