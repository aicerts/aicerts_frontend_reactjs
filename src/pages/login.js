import Image from 'next/image';
import Button from '../../shared/button/button';
import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';
import CopyrightNotice from '../app/CopyrightNotice';

const Login = () => {

    const handleClick = () => {
        // window.location.href = '/';
        alert("Login details required")
    };

    return (
        <div>
            <Row className="justify-content-md-center mt-5">
                <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container'>
                    <div className='golden-border-left'></div>
                    <Card className='login input-elements'>
                        <h2 className='title text-center'>Issuer Login</h2>
                        <p className='sub-text text-center'>Login using your credentials.</p>
                        <Form className='login-form'>
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
                                <Form.Control type="email" />
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
                                <Form.Control type="password" />
                            </Form.Group>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Button label="Login" onClick={handleClick} className="golden" />
                                <Link className="forgot-password-text" href="/forgot-passwords">Forgot Password?</Link>
                            </div>
                        </Form>
                    </Card>
                    <div className='golden-border-right'></div>
                </Col>
                <Col md={{span: 12}}>
                    <div className='copy-right text-center'>
                        <CopyrightNotice />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
