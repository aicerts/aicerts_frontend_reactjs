import React from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Button from '../../shared/button/button';

const Certificates = () => {

    const issueWithPdf = () => {
        window.location= '/issue-pdf-certificate'
    }

    const issueWithoutPdf = () => {
        window.location= '/issue-certificate'
    }

    return (
        <Container className='mt-5' style={{ height: '80vh'}}>
            <Row className='justify-content-md-center align-items-center h-100'>
                <Col xs md="4">
                    <Card className='verify-landing'>
                        <Card.Img variant="top" src="/icons/issue-pdf.svg" />
                        <Card.Body>
                            <Card.Title>Issue Certificate with PDF</Card.Title>
                            <Card.Text>
                            If you have the certiifcate pdf so you can issue that certificate on blockchain and get globally verifiable QR code Imprinted on it.
                            </Card.Text>
                            <Button label="With PDF &#8594;" className='golden' onClick={issueWithPdf}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs md="4">
                    <Card className='verify-landing mt-4 mt-md-0'>
                        <Card.Img variant="top" src="/icons/issue-pdf.svg" />
                        <Card.Body>
                            <Card.Title>Issue Certificate without PDF</Card.Title>
                            <Card.Text>
                            If you dont have pdf so you can select certificate template and provide the required credentials and issue the certificate on blockchain and get the globally variable certificate with the template you have selected.
                            </Card.Text>
                            <Button label="Without PDF &#8594;" className='golden' onClick={issueWithoutPdf}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Certificates;
