import Link from 'next/link';
import React from 'react';
import Button from '../../shared/button/button';
import { Form, Row, Col, Card } from 'react-bootstrap';

const Register = () => {
    const handleClick = () => {
        // window.location.href = '/';
        alert("Register details")
    };

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
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="address" className='mb-3'>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="country" className='mb-3'>
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="organization-type" className='mb-3'>
                                            <Form.Label>Organization Type</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="city" className='mb-3'>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="zip" className='mb-3'>
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Label>Industry Sector</Form.Label>
                                        <Form.Select aria-label="select" className='mb-3'>
                                            <option value="1">Technology</option>
                                            <option value="2">Technology 1</option>
                                            <option value="3">Technology 2</option>
                                        </Form.Select>

                                        <Form.Group controlId="state" className='mb-3'>
                                            <Form.Label>State</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>

                                        <Form.Group controlId="website-link" className='mb-3'>
                                            <Form.Label>Website Link</Form.Label>
                                            <Form.Control type="text" />
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
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group controlId="phone-number" className='mb-3'>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="degignation" className='mb-3'>
                                            <Form.Label>Degignation</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" />
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
                                        <Form.Group controlId="username" className='mb-3'>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group controlId="phone-number" className='mb-3'>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="degignation" className='mb-3'>
                                            <Form.Label>Degignation</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={{ span: 4 }} xs={{ span: 12 }}>
                                        <Form.Group controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className='text-center'>
                        <Button label="Submit" onClick={handleClick} className="golden" />
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Register;