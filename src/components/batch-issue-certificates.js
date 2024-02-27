// @ts-nocheck
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/button/button';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/legacy/image';

/**
 * @typedef {object} CertificateDisplayPageProps
 * @property {string} [cardId] - The ID of the selected card.
 */

/**
 * CertificateDisplayPage component.
 * @param {CertificateDisplayPageProps} props - Component props.
 * @returns {JSX.Element} - Rendered component.
 */
const CertificateDisplayPage = ({ cardId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
  const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;

  const handleSelectTemplate = () => {
    window.location.href = '/certificate'
  }

  const handleDownloadSample = () => {
    // Create a new anchor element
    const anchor = document.createElement('a');
    // Set the href attribute to the path of the file to be downloaded
    anchor.href = '/download-sample.xlsx';
    // Set the download attribute to the desired filename for the downloaded file
    anchor.download = 'sample.xlsx';
    // Append the anchor element to the document body
    document.body.appendChild(anchor);
    // Trigger a click event on the anchor element to initiate the download
    anchor.click();
    // Remove the anchor element from the document body
    document.body.removeChild(anchor);
  };

  // @ts-ignore
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileName = file?.name
    setSelectedFile(file);
    console.log('Selected file:', fileName, file.size, file.type);
  };

  const handleClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const uploadFile = async () => {
    window.location.href = '/certificate/download'
    if (!selectedFile) {
      return;
    }

    setSelectedFile(null); // Clear selection after upload
  };

  return (
    <Container className='dashboard pb-5'>
      <Row>
        <h3 className='page-title'>Batch Issuance</h3>
        <Col xs={12} md={4}>
          <Card className='p-0'>
            <Card.Header>Selected Template</Card.Header>
            <Card.Body>
              <img className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />
              <Button label="Select Another Template" className='outlined btn-select-template mt-5' onClick={handleSelectTemplate} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <div className='bulk-upload'>
            <div className='download-sample d-block d-md-flex justify-content-between align-items-center text-center'>
              <div className='tagline mb-3 mb-md-0'>Please refer to our sample file for batch upload.</div>
              <Button label="Download Sample &nbsp; &nbsp;" className='golden position-relative' onClick={handleDownloadSample} />
            </div>
            <div className='browse-file text-center'>
              <div className='download-icon position-relative'>
                <Image
                  src="/icons/cloud-upload.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Upload icon'
                />
              </div>
              <h4 className='tagline'>Upload  your batch issue certificate file here.</h4>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
              <Button label="Choose File" className='outlined' onClick={handleClick} />
              {selectedFile && (
                <div>
                  <p className='mt-4'>{selectedFile?.name}</p>
                  <Button label="Upload" className='golden' onClick={uploadFile} />
                </div>
              )}
              <div className='restriction-text'>Only <strong>XLSX</strong> is supported. <br/>(Upto 2 MB)</div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

CertificateDisplayPage.propTypes = {
  cardId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default CertificateDisplayPage;
