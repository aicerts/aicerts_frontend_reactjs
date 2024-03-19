// pages/select-certificate.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation
import Image from 'next/legacy/image';
import { useContext } from 'react';
import { AiOutlineClose,AiOutlineCheckCircle  } from 'react-icons/ai';
import CertificateContext from "../../utils/CertificateContext"
import AWS from "../../config/aws-config"
const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
// import image from "public/images/1709909965183_Badge.png"
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
const CardSelector = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const router = useRouter(); // Initialize useRouter hook
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [token, setToken] = useState(null);

  const [badgeFile, setBadgeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  // const [badgeUrl, setBadgeUrl] = useState(null);

  const {setCertificateUrl, certificateUrl, badgeUrl, setBadgeUrl, logoUrl, setLogoUrl, signatureUrl,setSignatureUrl, tab  } = useContext(CertificateContext);
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
  }, []);

  

  // Assuming you have configured AWS SDK and imported it





  const handleClose = () => {
    setShow(false);
};

  const hasErrors = () => {
    const errorFields = Object.values(errors);
    return errorFields.some((error) => error !== '');
  };
  const fileInputRefs = {
    badge: useRef(),
    logo: useRef(),
    signature: useRef(),
  };

  // @ts-ignore
  const handleChange = (event, fileType) => {
    const file = event.target.files[0];
    switch (fileType) {
      case 'badge':
        setBadgeFile(file);
        break;
      case 'logo':
        setLogoFile(file);
        break;
      case 'signature':
        setSignatureFile(file);
        break;
      default:
        break;
    }
  };

  console.log("Badge URL: ", selectedFile)

  const handleClick = async () => {
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Save the image reference as needed in your application state or database
      } else {
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const generatePresignedUrl = async (key) => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'certs365',
      Key: key,
      Expires: 3600, 
    };
  
    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      return null;
    }
  };

  const removeFile = (fileType) => {
    switch (fileType) {
      case 'badge':
        setBadgeFile(null);
        setBadgeUrl("")
        break;
      case 'logo':
        setLogoFile(null);
        setLogoUrl("")
        break;
      case 'signature':
        setSignatureFile(null);
        setSignatureUrl("")
        break;
      default:
        break;
    }
    // fileInputRefs[fileType].current.value = null;
  };

  const uploadFile = async (fileType) => {
    let selectedFile = null;
  
    switch (fileType) {
      case 'badge':
        selectedFile = badgeFile;
        break;
      case 'logo':
        selectedFile = logoFile;
        break;
      case 'signature':
        selectedFile = signatureFile;
        break;
      default:
        console.error('Invalid file type:', fileType);
        return;
    }
  
    if (!selectedFile) {
      setLoginError("No file selected.")
      setShow(true)
      console.error('No file selected.');
      return;
    }
  
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setLoginError("Invalid file type. Please upload a JPG, PNG, or SVG file.")
      setShow(true)
      console.error('Invalid file type. Please upload a JPG, PNG, or SVG file.');
      return;
    }
  
    setIsLoading(true);
  
    // Check file size
    const maxSize = 170 * 170; // Adjust the size limit as needed
    if (selectedFile.size > maxSize) {
      setLoginError('File size exceeds the allowed limit.');
      setShow(true);
      console.error('File size exceeds the allowed limit.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === "SUCCESS") {
          switch (fileType) {
            case 'badge':
              generatePresignedUrl(selectedFile?.name)
                .then(url => {
                  setBadgeUrl(url || null);
                  setLoginSuccess('Badge uploaded successfully');
                })
                .catch(error => {
                  console.error('Error generating pre-signed URL:', error);
                  setLoginError('Failed to generate pre-signed URL for badge');
                });
              break;
            case 'logo':
              generatePresignedUrl(selectedFile?.name)
                .then(url => {
                  setLogoUrl(url || null);
                  setLoginSuccess('Logo uploaded successfully');
                })
                .catch(error => {
                  console.error('Error generating pre-signed URL:', error);
                  setLoginError('Failed to generate pre-signed URL for logo');
                });
              break;
            case 'signature':
              generatePresignedUrl(selectedFile?.name)
                .then(url => {
                  setSignatureUrl(url || null);
                  setLoginSuccess('Signature uploaded successfully');
                })
                .catch(error => {
                  console.error('Error generating pre-signed URL:', error);
                  setLoginError('Failed to generate pre-signed URL for signature');
                });
              break;
            default:
              break;
          }
          
          setShow(true);
          setIsLoading(false);
          // Save the image reference as needed in your application state or database
        } else {
          setLoginError('Error in Uploading ' + fileType.charAt(0).toUpperCase() + fileType.slice(1));
          setShow(true);
          setIsLoading(false);
        }
        
      } else {
        setLoginError('Failed to upload ' + fileType.charAt(0).toUpperCase() + fileType.slice(1));
        setShow(true);
        setIsLoading(false);
        console.error('Failed to upload image:', response.statusText);
      }
    } catch (error) {
      setLoginError('Failed to upload ' + fileType.charAt(0).toUpperCase() + fileType.slice(1));
      setIsLoading(false);
      setShow(true);
      console.error('Error uploading image:', error);
    }
  };
  
  

  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
    let certificateUrl;
    switch(cardIndex) {
        case 0:
            certificateUrl = "https://html.aicerts.io/Background123.png";
            break;
        case 1:
            certificateUrl = "https://html.aicerts.io/Background111.png";
            break;
        
        case 2:
            certificateUrl = "https://html.aicerts.io/Background_2.png";
            break;
        
        case 3:
            certificateUrl = "https://html.aicerts.io/Blank%20Certificate_%2304.png";
            break;
        case 4:
            certificateUrl = "https://html.aicerts.io/Background233.png";
            break;
        case 5:
            certificateUrl = "https://html.aicerts.io/Background.png";
            break;
        
        default:
            certificateUrl = "https://html.aicerts.io/Background123.png";
            break;
    }
    setCertificateUrl(certificateUrl)

  };

  const handleSelectTemplate = () => {
    if (!logoUrl) {
      setLoginError("Please upload the logo ");
      setShow(true);
      return;
    }
  
    if (!certificateUrl) {
      setLoginError("Please upload the certificate ");
      setShow(true);
      return;
    }
  
    if (!signatureUrl) {
      setLoginError("Please upload the signature");
      setShow(true);
      return;
    }
    let route;
  if(tab==0){
    route = `/issue-certificate`;
  }else{

    route = `/certificate/${selectedCard}`;
  }
    if (badgeUrl) {
      route += `?b=${badgeUrl}`;
    }
    router.push(route);
  };
  
  
  const cards = [
    {
      id: 1,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_1.png',
    },
    {
      id: 2,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_2.png',
    },
    {
      id: 3,
      imageUrl: 'https://images.netcomlearning.com/ai-certs/Certificate_template_3.png',
    },
    {
      id: 4,
      imageUrl: 'https://html.aicerts.io/Blank%20Certificate_%2304.png',
    },
    {
      id: 5,
      imageUrl: 'https://html.aicerts.io/Background233.png',
    },
    {
      id: 6,
      imageUrl: 'https://html.aicerts.io/Background.png',
    }
    
  ];

  useEffect(() => {
    // Select the first card onLoad
    handleCardSelect(0);
  }, []); // Empty dependency array means it runs only once after the component is mounted

  return (
    <Container className='dashboard'>
      {/* <img src="https://certs365.s3.amazonaws.com/aicertsbadge.png?AWSAccessKeyId=AKIAXHMUTWOXC7ZCJL54&Expires=1710336240&Signature=tYGu9i7sxYaPk58W4xvk26yvBo0%3D" alt='img' height={100} /> */}
      <Row>
        <h3 className='page-title'>Batch Issuance</h3>
        <Col xs={12} md={6}>
        <div className='upload-badge-container'>
        <div className='upload-column'>
      {badgeFile ? (
        <div className="file-info">
          <span>{badgeFile.name}</span>
          <AiOutlineClose onClick={() => removeFile('badge')} className="close-icon" />
        </div>
      ) : (
        <div>
          <input type="file" ref={fileInputRefs.badge} onChange={(event) => handleChange(event, 'badge')} />
        </div>
      )}
      {badgeUrl ? (
        <AiOutlineCheckCircle className="check-icon" />
      ) : (
        <Button disabled={badgeFile ? false : true} label='Upload Badge' className='button-cert' onClick={() => uploadFile('badge')} />
      )}
    </div>
    <div className='upload-column'>
  {logoFile ? (
    <div className="file-info">
      <span>{logoFile.name}</span>
      <AiOutlineClose onClick={() => removeFile('logo')} className="close-icon" />
    </div>
  ) : (
    <div>
      <input type="file" ref={fileInputRefs.logo} onChange={(event) => handleChange(event, 'logo')} />
    </div>
  )}
  {logoUrl ? (
    <AiOutlineCheckCircle className="check-icon" />
  ) : (
    <Button disabled={logoFile ? false : true} label='Upload Logo' className='button-cert' onClick={() => uploadFile('logo')} />
  )}
</div>

<div className='upload-column'>
  {signatureFile ? (
    <div className="file-info">
      <span>{signatureFile.name}</span>
      <AiOutlineClose onClick={() => removeFile('signature')} className="close-icon" />
    </div>
  ) : (
    <div>
      <input type="file" ref={fileInputRefs.signature} onChange={(event) => handleChange(event, 'signature')} />
    </div>
  )}
  {signatureUrl ? (
    <AiOutlineCheckCircle className="check-icon" />
  ) : (
    <Button disabled={signatureFile ? false : true} label='Upload Signature' className='button-cert' onClick={() => uploadFile('signature')} />
  )}
</div>

    </div>
            <Card className='p-0'>
                <Card.Header>Select a Template</Card.Header>
                <Row className='p-3'>
                    {cards.map((card, index) => (
                        <Col key={card.id} md={4}>
                            <Card className='cert-thumb' style={{ cursor: 'pointer' }} onClick={() => handleCardSelect(index)}>                        
                                <Card.Img variant="top" src={card.imageUrl} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </Col>
        <Col xs="12" md={6}>
       
          
          {selectedCard !== null && (
            <Card className='preview-certificate h-auto'>
              <Card.Header>Preview</Card.Header>
              <Card.Body className='pt-0'>
                <img className='img-fluid' src={cards[selectedCard].imageUrl} alt={`Card ${cards[selectedCard].id}`} />
                <Button label="Select this template" className='golden w-100' onClick={handleSelectTemplate} />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
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

                <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                    <Modal.Body className='p-5'>
                        {loginError !== '' ? (
                            <>
                                <div className='error-icon'>
                                    <Image
                                        src="/icons/close.svg"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Loader'
                                    />
                                </div>
                                <h3 style={{ color: 'red' }}>{loginError}</h3>
                                <button className='warning' onClick={handleClose}>Ok</button>
                            </>
                        ): (
                            <>
                                <div className='error-icon'>
                                    <Image
                                        src="/icons/check-mark.svg"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Loader'
                                    />
                                </div>
                                <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
                                <button className='success' onClick={handleClose}>Ok</button>
                            </>
                        )}


                    </Modal.Body>
                </Modal>
    </Container>
  );
};

export default CardSelector;
