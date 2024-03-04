import React, { useState } from 'react';
import profileData from '../data/profileData.json';
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import Image from 'next/legacy/image';
import Button from '../../shared/button/button';

const ProfileDetails = () => {
    const [editable, setEditable] = useState(false);
    const dynamicHeight = '5px';
    const profile = profileData[0];

    const handleEditToggle = () => {
        setEditable(!editable);
    };

    return (
        <>
            <Container className="mt-5 mb-5 user-details">
                <Row>
                    <Col xs={12} md={4}>
                        <Card>
                            <Card.Body>
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img
                                        src={profile.profileImage}
                                        alt="Profile"
                                        className="rounded-circle p-1 bg-primary"
                                        width="110"
                                    />
                                    <div className="mt-3">
                                        <h4 className='name'>{profile.name}</h4>
                                        <p className="role mb-1">{profile.role}</p>
                                        <p className="address">{profile.location}</p>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <ul className="list-group list-group-flush">
                                    {profile.socialMedia[0].map((item) => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap ps-0 pe-0">
                                            <div className="icons d-flex align-items-center" style={{ columnGap: "8px" }}>
                                                {/* <Image 
                                                    src={
                                                        item.icon === "website" && "https://images.netcomlearning.com/ai-certs/icons/www.svg" || 
                                                        item.icon === "phone" && "https://images.netcomlearning.com/ai-certs/icons/phone-call.svg" ||
                                                        item.icon === "email" && "https://images.netcomlearning.com/ai-certs/icons/email-darksvg.svg"
                                                    }
                                                    width={24}
                                                    height={24}
                                                    alt="Icons"
                                                /> */}
                                                {item.title}
                                            </div>
                                            <span className="lead-info">{item.url || item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col className="col-sm-3">
                                        <h6 className="mb-0 icons">Full Name</h6>
                                    </Col>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" placeholder="John Doe" disabled={!editable}/>
                                    </div>
                                </Row>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0 icons">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" placeholder="john@example.com" disabled={!editable}/>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0 icons">Phone</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" placeholder="(239) 816-9029" disabled={!editable}/>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0 icons">Mobile</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" placeholder="(320) 380-4539" disabled={!editable}/>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0 icons">Address</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" placeholder="Bay Area, San Francisco, CA" disabled={!editable}/>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0 icons">Organization Type</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <Form.Select disabled={!editable}>
                                            <option>AI & Blockchain</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center" style={{ columnGap: "10px" }}>
                                    {editable ? (
                                            <Button label="Cancel" className="outlined pe-3 ps-3 py-2" onClick={handleEditToggle}/>
                                        ) : (
                                            <Button label="Edit" className="golden pe-3 ps-3 py-2" onClick={handleEditToggle}/>
                                        )}
                                        {editable && (
                                            <Button label="Save cahnges" className="golden pe-3 ps-3 py-2" onClick={handleEditToggle}/>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProfileDetails;
