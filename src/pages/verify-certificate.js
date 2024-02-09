import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';
import certificate from "../services/certificaeServices";
import { useRouter } from 'next/router';
const VerifyCertificate = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsQR, setDetailsQR] = useState(null);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isLoading) {
        // Simulate progress with a timer
        const interval = setInterval(() => {
            // Update the progress (you can replace this with your API logic)
            setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 10 : 100));
        }, 500);

        // Clean up the interval when the component unmounts or loading is complete
        return () => clearInterval(interval);
    } else {
        // Reset the progress when loading is complete
        setProgress(0);
    }
}, [isLoading]);

  useEffect(() => {
    // Extract encrypted link from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const qValue = urlParams.get('q');
    const ivValue = urlParams.get('iv');
    

    if (qValue && ivValue) {
     
      handleVerifyCertificate(qValue,ivValue);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleVerifyCertificate = (qValue,ivValue) => {
    // Call the verify API with the encrypted link
    const data = {
      qValue,ivValue
    }
    certificate?.verifyCertificate(data, (response) => {
      // Handle the API response here (success or error)
      console.log(response,"res")
      if(response.status == "SUCCESS"){
        if (response.data.status === 'PASSED') {
          setDetailsQR(response.data);
          setVerified(true);
        } else if (response.data.status === 'FAILED') {
          setVerified(false);
        } else {
          // Handle verification error
          console.error('Verification failed!', response.error);
        }
      } else {
        console.error('Verification failed!', response.error);
      }
     

      setIsLoading(false);
    });
  };

  if (isLoading) {
    return (
      <Modal className='loader-modal' show={isLoading} centered>
        <Modal.Body>
          <div className='certificate-loader'>
            <Image
              src="/backgrounds/certification-loader.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <h3>Verifying...</h3>
          <ProgressBar now={progress} />
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div className='container-fluid'>
      <Row className="justify-content-center mt-4 verify-documents">
        <Col xs={{ span: 12 }} md={{ span: 10 }}>
          <Card className='p-0 p-md-4'>
            <Row className='justify-content-center'>
              <Col xs={{ span: 12 }} md={{ span: 12 }}>
                {detailsQR && verified && (
                  // Display certificate details
                  <>
                   <Card className='valid-cerficate-info'>
                                            <Card className='dark-card position-relative'>
                                                <div className='d-block d-lg-flex justify-content-between align-items-center certificate-internal-info'>
                                                    <div className='badge-banner'>
                                                        <Image
                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                            layout='fill'
                                                            objectFit='contain'
                                                            alt='Badge Banner'
                                                        />
                                                    </div>
                                                    <div className='hash-info'>
                                                        <Row className='position-relative'>
                                                            <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                                <div className='hash-title'>Certification Number</div>
                                                                <div className='hash-info'>{detailsQR['Certificate_Number']}</div>
                                                            </Col>
                                                            <Col xs={{ span: 12 }} md={{ span: 6 }}>

                                                                <div className='hash-title'>Certification Name</div>
                                                                <div className='hash-info'>{detailsQR['CourseName']}</div>
                                                            </Col>
                                                            <hr />
                                                            <hr className='vertical-line' />
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Card>

                                            <div className='cerficate-external-info d-block d-lg-flex justify-content-between align-items-center text-md-left text-center mb-md-0 mb-4  '>
                                                <div className='details'>
                                                    <div className='heading'>Name</div>
                                                    <div className='heading-info'>{detailsQR['Name']}</div>
                                                </div>
                                                <div className='details'>
                                                    <div className='heading'>Grant Date</div>
                                                    <div className='heading-info'>{detailsQR['Grant_Date']}</div>
                                                </div>
                                                <div className='details'>
                                                    <div className='heading'>Expiration Date</div>
                                                    <div className='heading-info'>{detailsQR['Expiration_Date']}</div>
                                                </div>
                                                <div className='details varification-info'>
                                                    {/* <a href={detailsQR['Polygon URL']} target="_blank" className='heading-info'>Verify on Blockchain</a> */}
                                                    <Button href={detailsQR['Polygon_URL']} target="_blank" className='heading-info' variant="primary">
                                                        Verify on Blockchain
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                  </>
                )}

                {!verified && (
                  // Display invalid certificate image
                  <>
                  <div className='badge-banner'>
                    <Image
                      src="/backgrounds/invalid-certificate.gif"
                      layout='fill'
                      objectFit='contain'
                      alt='Badge Banner'
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h4 style={{ margin: '10px 10px', color: 'red' }}>Certificate Not Verified</h4>
                  </div>
                </>
                
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VerifyCertificate;
