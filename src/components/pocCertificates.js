import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib'; 


// const obj = {
//   status: "SUCCESS",
//   message: "Batch of Certifications issued successfully",
//   details: {
//       email: "basit@aicerts.io",
//       issuerId: "0xa0fB913c93A7696420D02e2FF77B93aCF3939133",
//       urls: [
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
//           "https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/1722868493658_1AAAA50026411.png",
         
//       ]
//   }
// }


const PocCertificates = ({ certificates }) => {
  const [visibleCertificates, setVisibleCertificates] = useState(certificates);
  const [page, setPage] = useState(1);
  const [prevModal, setPrevModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [singleDetail, setSingleDetail] = useState(null);
  const { ref, inView } = useInView({ threshold: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const loadMoreCertificates = () => {
      const newCertificate = certificates[page - 1];
      if (newCertificate) {
        setVisibleCertificates((prev) => [...prev, newCertificate]);
        setPage((prev) => prev + 1);
      }
    };

    if (inView) {
      loadMoreCertificates();
    }
  }, [inView, page, certificates]);

  const handleClose = () => {
    setShow(false);
  };

  const handlePrevCert = (url) => {
    setPrevModal(true);
    setImageUrl(url);
  };

  const closePrevCert = () => {
    setPrevModal(false);
    setImageUrl('');
  };


  const handleDownloadPDF = async (imageUrl) => {
    
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer' // Ensure response is treated as an ArrayBuffer
        });
        
        const pdfDoc = await PDFDocument.create();
        // Adjust page dimensions to match the typical horizontal orientation of a certificate
        const page = pdfDoc.addPage([792, 612]); // Letter size page (11x8.5 inches)
        
        // Embed the image into the PDF
        const pngImage = await pdfDoc.embedPng(response.data);
        // Adjust image dimensions to fit the page
        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: 792, // Width of the page
            height: 612, // Height of the page
        });
        
        const pdfBytes = await pdfDoc.save();
        
        // Create a blob containing the PDF bytes
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${"Cert"}.pdf`; // Set the filename for download
        link.click();
        
        // Revoke the URL to release the object URL
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        // Handle error state appropriately
    } finally {
    }
};

  return (
    <div>
      <Row  className='d-flex flex-row justify-content-start '>
        {visibleCertificates?.map((url, index) => (
          <Col   key={index} xs={12} md={4}>
          <div className='prev-cert-card mb-3'>
            <div className='cert-prev' >
              {
                isLoading ?
                  <div className="image-container skeleton"></div>
                  :
                  <Image
                    src={url}
                    width={250}
                    height={220}
                    objectFit='contain'
                    alt={`Certificate ${index + 1}`}
                  />
              }


            </div>
            <div className='d-flex justify-content-between align-items-center'>
              {/* <Form.Group controlId={`Certificate ${index + 1}`}>
                <Form.Check
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={(event) => handleCheckboxChange(event, index)}
                />
              </Form.Group> */}

              <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={() => handlePrevCert(url)}>
                  <Image
                    src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                    width={16}
                    height={16}
                    alt='View Certificate'
                  />
                </span>
                <span className='d-flex align-items-center' style={{ columnGap: "10px" }}
                  onClick={() => handleDownloadPDF(url)}>
                  <Image
                    src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                    width={16}
                    height={16}
                    alt='Download Certificate'
                  />
                </span>
              </div>
            </div>
          </div>
        </Col>
        ))}
        <div ref={ref} style={{ height: 1 }} />
      </Row>

      <Modal
        size="lg"
        centered
        className='preview-modal'
        show={prevModal}
        onHide={closePrevCert}
      >
        <Modal.Body>
          <div className='close-modal' onClick={closePrevCert}>
            <Image
              src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
              layout='fill'
              objectFit='contain'
              alt='Close'
            />
          </div>
          <div className='prev-cert'>
            <Image
              src={imageUrl}
              layout='fill'
              objectFit='contain'
              alt='Certificate'
            />
          </div>
          <div className='text-center mt-4'>
          <Button className='global-button golden' onClick={() => handleDownloadPDF(imageUrl)}>Download</Button>

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
                  src="/icons/success.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <h3 style={{ color: '#CFA935' }}>{loginSuccess}</h3>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PocCertificates;
