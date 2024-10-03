import React from 'react'
import { Col, Row } from 'react-bootstrap'

const Settings = () => {
  return (
    <div className='page-bg'>
            <div className='position-relative settings-container h-100'>
                <div  className='settings-title' >
            <h3>Settings</h3>
                </div>

       <div className='org-details'>
                            <h2 className='title'>Organization Details</h2>
                            <Row>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Organization Name</div>
                                        <div className='info'>-</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Organization Type</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Industry Sector</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Website</div>
                                        <div className='info'>
                                         
                                        </div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Address</div>
                                        <div className='info'>
                                        </div>
                                    </Col>
                            </Row>

                        </div>
    </div>
    </div>
  )
}

export default Settings