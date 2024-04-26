// pages/select-certificate.js
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Tooltip, OverlayTrigger, Modal, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation
import Image from 'next/legacy/image';
import { useContext } from 'react';
import { AiOutlineClose, AiOutlineCheckCircle } from 'react-icons/ai';
import CertificateContext from "../../utils/CertificateContext"
import AWS from "../../config/aws-config"
import { getImageSize } from 'react-image-size';

const iconUrl = process.env.NEXT_PUBLIC_BASE_ICON_URL;
// import image from "public/images/1709909965183_Badge.png"
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;
const CardSelector = () => {

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
  const [tab, setTab] = useState(null);

  const [badgeFile, setBadgeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const [badgeFileName, setBadgeFileName] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [signatureFileName, setSignatureFileName] = useState("");
  // const [badgeUrl, setBadgeUrl] = useState(null);

  const { setCertificateUrl, certificateUrl, badgeUrl, setBadgeUrl, logoUrl, issuerName, issuerDesignation, setLogoUrl, signatureUrl, setSignatureUrl, setSelectedCard, selectedCard, setIssuerName, setissuerDesignation } = useContext(CertificateContext);

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { tab } = router.query;

    setTab(tab)
    if (storedUser && storedUser.JWTToken) {
      // If token is available, set it in the state
      setToken(storedUser.JWTToken);
    } else {
      // If token is not available, redirect to the login page
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);


  useEffect(() => {
    // Function to retrieve data from session storage and set local stat
    sessionStorage.removeItem('certificatesList');
    const retrieveDataFromSessionStorage = () => {
      const badgeUrlFromStorage = JSON.parse(sessionStorage.getItem("badgeUrl"));
      const logoUrlFromStorage = JSON.parse(sessionStorage.getItem("logoUrl"));
      const signatureUrlFromStorage = JSON.parse(sessionStorage.getItem("signatureUrl"));
      const issuerNameFromStorage = sessionStorage.getItem("issuerName");
      const issuerDesignationFromStorage = sessionStorage.getItem("issuerDesignation");

      if (badgeUrlFromStorage) {
        setBadgeUrl(badgeUrlFromStorage.url)
        setBadgeFileName(badgeUrlFromStorage.fileName)
      };
      if (logoUrlFromStorage) {
        setLogoUrl(logoUrlFromStorage.url);
        setLogoFileName(logoUrlFromStorage.fileName)

      }
      if (signatureUrlFromStorage) {
        setSignatureUrl(signatureUrlFromStorage.url);
        setSignatureFileName(signatureUrlFromStorage.fileName)
      }
      if (issuerNameFromStorage) {
        setIssuerName(issuerNameFromStorage);
      }
      if (issuerDesignationFromStorage) {
        setissuerDesignation(issuerDesignationFromStorage);
      }
    };


    retrieveDataFromSessionStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleIssuerNameChange = (e) => {
    const inputValue = e.target.value;
     // Validation for preventing space at the start
      if (inputValue.startsWith(" ")) {
          return; // Do nothing if there's a space at the start
      }

      // Validation for disallowing special characters using regex
      if (!/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
          return; // Do nothing if the value contains special characters
      }

      // Validation for disallowing numbers
      if (/\d/.test(inputValue)) {
          return; // Do nothing if the value contains numbers
      }

      // Other validations such as length checks
      if (inputValue.length > 30) {
          return; // Do nothing if the length exceeds 30 characters
      }

      // If all validations pass, update the state and sessionStorage
      setIssuerName(inputValue);
      sessionStorage.setItem('issuerName', inputValue);
    // if (inputValue.length <= 30) {
    //   setIssuerName(inputValue);
    //   sessionStorage.setItem('issuerName', inputValue);
    // } else {
    //   // Show error message here, for example:
    //   // alert('Issuer name must be 30 characters or less');
    // }
  };

  const handleIssuerDesignationChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 30) {
      setissuerDesignation(inputValue);
      sessionStorage.setItem('issuerDesignation', inputValue);
    } else {
      // Show error message here, for example:
      alert('Issuer designation must be 30 characters or less');
    }
  };



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

  // // @ts-ignore
  // const handleChange = (event, fileType) => {
  //   const file = event.target.files[0];
  //   switch (fileType) {
  //     case 'badge':
  //       setBadgeFile(file);
  //       break;
  //     case 'logo':
  //       setLogoFile(file);
  //       break;
  //     case 'signature':
  //       setSignatureFile(file);
  //       break;
  //     default:
  //       break;
  //   }
  // };


  const handleChange = async (event, fileType) => {
    const file = event.target.files[0];

    if (!file) return; // Ensure a file is selected

    try {
      const { width, height } = await getImageSize(URL.createObjectURL(file));
      const fileSize = file.size; // File size in bytes

      let maxWidth, maxHeight, minSize, maxSize;

      switch (fileType) {
        case 'badge':
          maxWidth = 175;
          maxHeight = 175;
          minSize = 10 * 1024; // 10 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        case 'logo':
          maxWidth = 400;
          maxHeight = 65;
          minSize = 4 * 1024; // 5 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        case 'signature':
          maxWidth = 220;
          maxHeight = 65;
          minSize = 5 * 1024; // 5 KB
          maxSize = 30 * 1024; // 30 KB
          break;
        default:
          maxWidth = null;
          maxHeight = null;
          minSize = null;
          maxSize = null;
      }

      if (fileSize < minSize || fileSize > maxSize) {
        setLoginError(`File size for ${fileType} must be between ${minSize / 1024}KB and ${maxSize / 1024}KB.`);
        setShow(true);
        // Clear the input field
        event.target.value = '';
        return;
      }

      if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
        setLoginError(`Invalid dimensions for ${fileType}. Maximum dimensions are ${maxWidth}x${maxHeight}.`);
        setShow(true);
        // Clear the input field
        event.target.value = '';
        return;
      }

      // If dimensions and file size are valid, proceed to set the file
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
    } catch (error) {
      console.error(error);
      // Handle error fetching image size
      setLoginError('Please upload a correct image file.');
      setShow(true);
    }
  };




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
      Expires: 36000,
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
        sessionStorage.removeItem("badgeUrl");
        setBadgeFile(null);
        setBadgeUrl("")
        setBadgeFileName("")
        break;
      case 'logo':
        sessionStorage.removeItem("logoUrl");
        setLogoFile(null);
        setLogoUrl("")
        setLogoFileName("")
        break;
      case 'signature':
        sessionStorage.removeItem("signatureUrl");
        setSignatureFile(null);
        setSignatureUrl("")
        setSignatureFileName("")
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
    // if (selectedFile.size > maxSize) {
    //   setLoginError('File size exceeds the allowed limit.');
    //   setShow(true);
    //   console.error('File size exceeds the allowed limit.');
    //   return;
    // }

    if (selectedFile.size > maxSize) {
      setLoginError('File dimension exceeds the allowed limit.');
      setShow(true);
      console.error('File dimension exceeds the allowed limit.');
      setIsLoading(false);
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
                  setBadgeFileName(selectedFile?.name)
                  sessionStorage.setItem("badgeUrl", JSON.stringify({ fileName: selectedFile?.name, url: url }))
                  setLoginError("")
                  setLoginSuccess('Badge uploaded successfully');
                  setShow(true)
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
                  setLogoFileName(selectedFile?.name)
                  sessionStorage.setItem("logoUrl", JSON.stringify({ fileName: selectedFile?.name, url: url }))
                  setLoginError("")
                  setLoginSuccess('Logo uploaded successfully');
                  setShow(true)
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
                  setSignatureFileName(selectedFile?.name)
                  sessionStorage.setItem("signatureUrl", JSON.stringify({ fileName: selectedFile?.name, url: url }))
                  setLoginError("")
                  setLoginSuccess('Signature uploaded successfully');
                  setShow(true);
                })
                .catch(error => {
                  console.error('Error generating pre-signed URL:', error);
                  setLoginError('Failed to generate pre-signed URL for signature');
                });
              break;
            default:
              break;
          }


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
    switch (cardIndex) {
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

    if (!issuerName.trim()) {
      setLoginError("Issuer Name cannot be empty");
      setShow(true);
      return;
    } else if (issuerName.trim().length === 1) {
      setLoginError("Issuer Name should contain more than one character");
      setShow(true);
      return;
    }

    if (!issuerDesignation.trim()) {
      setLoginError("Issuer Designation cannot be empty");
      setShow(true);
      return;
    } else if (issuerDesignation.trim().length === 1) {
      setLoginError("Issuer Designation should contain more than one character");
      setShow(true);
      return;
    }


    let route;
    if (tab == 0) {
      route = `/issue-certificate`;
    } else {

      route = `/certificate/${selectedCard}`;
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
      imageUrl: '/backgrounds/Certificate_template_4.png',
    },
    {
      id: 5,
      imageUrl: '/backgrounds/Certificate_template_6.png',
    },
    {
      id: 6,
      imageUrl: '/backgrounds/Certificate_template_5.png',
    }

  ];


  useEffect(() => {
    // Select the first card onLoad
    handleCardSelect(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means it runs only once after the component is mounted

  return (
    <Container className='dashboard'>
      {/* <img src="https://certs365.s3.amazonaws.com/aicertsbadge.png?AWSAccessKeyId=AKIAXHMUTWOXC7ZCJL54&Expires=1710336240&Signature=tYGu9i7sxYaPk58W4xvk26yvBo0%3D" alt='img' height={100} /> */}
      <Row>
        {tab == 0 &&
          <h3 className='page-title'>Issue Certifications</h3>
        }
        {tab == 1 &&
          <h3 className='page-title'>Batch Issuance</h3>
        }

        <Col xs={12} md={6}>
          <Form.Group controlId="name" className='mb-3'>
            <Form.Label>Issuer Name <span className='text-danger'>*</span></Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name='name'
                value={issuerName}
                onChange={handleIssuerNameChange}
                required
                maxLength={14} // Limit the input to 30 characters
              />
              <InputGroup.Text>{issuerName.length}/14</InputGroup.Text> {/* Display character count */}
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="date-of-issue" className='mb-3'>
            <Form.Label>Issuer Designation <span className='text-danger'>*</span></Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name='issuerDesignation'
                value={issuerDesignation}
                onChange={handleIssuerDesignationChange}
                required
                maxLength={20} // Limit the input to 30 characters
              />
              <InputGroup.Text>{issuerDesignation.length}/20</InputGroup.Text> {/* Display character count */}
            </InputGroup>
          </Form.Group>

          <div className='upload-badge-container'>

            <div className='upload-column'>
              {badgeFileName ? (
                <div className="file-info">
                  <span>{badgeFileName}</span>
                  <AiOutlineClose onClick={() => removeFile('badge')} className="close-icon" />
                </div>
              ) : (
                <div>
                  <p className="small-p">*Badge dimensions should be up to H:175px W:175px and .png only</p>
                  <p className="small-p">*Badge size should be 10-30kb</p>
                  <input type="file" accept="image/*" ref={fileInputRefs.badge} onChange={(event) => handleChange(event, 'badge')} />
                </div>
              )}
              {badgeUrl ? (
                <AiOutlineCheckCircle className="check-icon" />
              ) : (
                <Button disabled={badgeFile ? false : true} label='Upload Badge' className='button-cert' onClick={() => uploadFile('badge')} />
              )}
            </div>
            <div className='upload-column'>
              {logoFileName ? (
                <div className="file-info">
                  <span>{logoFileName}</span>
                  <AiOutlineClose onClick={() => removeFile('logo')} className="close-icon" />
                </div>
              ) : (
                <div>
                  <p className="small-p">*Logo dimensions should be up to H:65px W:400px and .png only</p>
                  <p className="small-p">*Logo size should be 5-30kb</p>
                  <input required type="file" accept="image/*" ref={fileInputRefs.logo} onChange={(event) => handleChange(event, 'logo')} />
                </div>
              )}
              {logoUrl ? (
                <AiOutlineCheckCircle className="check-icon" />
              ) : (
                <Button disabled={logoFile ? false : true} label='Upload Logo' className='button-cert' onClick={() => uploadFile('logo')} />
              )}
            </div>

            <div className='upload-column'>
              {signatureFileName ? (
                <div className="file-info">
                  <span>{signatureFileName}</span>
                  <AiOutlineClose onClick={() => removeFile('signature')} className="close-icon" />
                </div>
              ) : (
                <div>
                  <p className="small-p">*Signature dimensions should be up to H:65px W:220px and .png only</p>
                  <p className="small-p">*Signature size should be 5-30kb</p>
                  <input type="file" accept="image/*" ref={fileInputRefs.signature} onChange={(event) => handleChange(event, 'signature')} />
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
            <Row className='p-3' >
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
                <Image height={350} width={450} className='img-fluid' src={cards[selectedCard].imageUrl} alt={`Card ${cards[selectedCard].id}`} />
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
          ) : (
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
