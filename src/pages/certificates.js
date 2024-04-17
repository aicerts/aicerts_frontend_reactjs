import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import CertificateContext from "../utils/CertificateContext"
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;

const Certificates = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const {tab, setTab } = useContext(CertificateContext);

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (storedUser && storedUser.JWTToken) {
          // If token is available, set it in the state
          setToken(storedUser.JWTToken);
        } else {
          // If token is not available, redirect to the login page
          router.push('/');
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const issueWithPdf = () => {
        window.location= '/issue-pdf-certificate'
    }

    const issueWithoutPdf = () => {
        setTab(0)
        window.location= '/certificate?tab=0'
    }

    const issueBatchPdf = () => {
        setTab(1)
        window.location= '/certificate?tab=1'
    }

    return (
        <Container className='mt-5' style={{ height: '80vh'}}>
            <Row className='justify-content-md-center align-items-center h-100'>
                <Col xs="12" md="6" lg="4">
                    <Card className='verify-landing'>
                        <Card.Img variant="top" src={`${iconUrl}/issue-pdf.svg`} />
                        <Card.Body>
                            <Card.Title>Issue Certification with PDF</Card.Title>
                            <Card.Text>If you have the certificate in PDF format, you can utilize our platform to securely issue the certification on the blockchain. This process ensures the addition of a globally verifiable QR code directly onto your certificate, providing enhanced credibility and ease of verification.</Card.Text>
                            <Button label="With PDF &#8594;" className='golden' onClick={issueWithPdf}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" md="6" lg="4">
                    <Card className='verify-landing mt-4 mt-md-0'>
                        <Card.Img variant="top" src={`${iconUrl}/issue-pdf.svg`} />
                        <Card.Body>
                            <Card.Title>Issue Certification without PDF</Card.Title>
                            <Card.Text>If you find yourself without a PDF document, fret not. You can simply select a certification template that suits your needs, provide the necessary details, and effortlessly issue your certification on the blockchain. This seamless process ensures that you receive a globally recognized certification.</Card.Text>
                            <Button label="Without PDF &#8594;" className='golden' onClick={issueWithoutPdf}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="12" md="12" lg="4" className='mt-0 mt-md-4 mt-lg-0'>
                    <Card className='verify-landing mt-4 mt-md-0'>
                        <Card.Img variant="top" src={`${iconUrl}/batch-issue-certificate.svg`} />
                        <Card.Body>
                            <Card.Title>Batch Issue Certification PDF</Card.Title>
                            <Card.Text>Streamline your batch issuance process seamlessly with our Excel template. Choose from a variety of certification templates, input your data, and experience the power of blockchain-backed batch issuance. Effortlessly obtain globally recognized certifications bearing the template of your choice, ensuring efficiency and authenticity in every batch.</Card.Text>
                            <Button label="Without PDF &#8594;" className='golden' onClick={issueBatchPdf}/>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Certificates;
