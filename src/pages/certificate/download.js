import React, { useState, useRef } from 'react';
import Button from '../../../shared/button/button';
import { Container, Row, Col, Card, Form, Table, Modal } from 'react-bootstrap';
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

const DownloadCertificate = ({ cardId }) => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [prevModal, setPrevModal] = useState(false);

    const tableData = [
      {
        "issuerName": "Ai Certs 1",
        "certificateNumber": "DFJJSJDFJ9234"
      },
      {
        "issuerName": "Ai Certs 2",
        "certificateNumber": "DFJJSJDFJ9236"
      }
    ]

    // Toggle Grid / List view
    const toggleViewMode = () => {
      setIsGridView(!isGridView); // Toggle the view mode
    };

     // Toggle Check/Uncheck onclick on Thumbnail certificate
    const handleCheckboxClick = () => {
      setIsChecked(!isChecked);
    };

    // Triger Preview Modal
    const handlePrevCert = () => {
      setPrevModal(true)
    }

    // close Preview Modal
    const closePrevCert = () => {
      setPrevModal(false)
    }

    // Creating an array with 100 elements, you can replace it with your actual data
    // const tableData = Array.from({ length: 100 }, (_, index) => ({
    //   issuerName: `Issuer ${index + 1}`,
    //   certificateNumber: `Certificate ${index + 1}`
    // }));

    // Search functionality based on Isser name and certificate number
    const filteredData = tableData.filter(rowData =>
      rowData.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rowData.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check/Uncheck table data
    const handleCheckboxChange = (event, index) => {
      const isChecked = event.target.checked;
      setCheckedItems(prevState => ({
        ...prevState,
        [index]: isChecked
      }));
    };

    // Check/Uncheck all table data
    const handleSelectAllChange = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
      const updatedCheckedItems = {};
      for (let i = 0; i < tableData.length; i++) {
        updatedCheckedItems[i] = isChecked;
      }
      setCheckedItems(updatedCheckedItems);
    };

    // Get the selected template from the previous screeen
    const parsedCardId = typeof cardId === 'string' ? parseInt(cardId) : cardId || 0;
    const certificateUrl = `https://images.netcomlearning.com/ai-certs/Certificate_template_${parsedCardId + 1}.png`;

    // Update the searchQuery state
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };

    return (
      <>
        <Container className='dashboard pb-5 pt-5'>
          <Row>
            <Col xs={12} md={4}>
              <h3 className='page-title mt-0'>Batch Issuance</h3>
              <Card className='p-0 h-auto'>
                <Card.Header>Selected Template</Card.Header>
                <Card.Body>
                  <div className='issued-info'>
                    <div className='label'>No. of certificates to be issued</div>
                    <div className='detail'>20</div>
                    <div className='label'>Organisation</div>
                    <div className='detail'>AI CERTs</div>
                    <div className='label'>Issuer</div>
                    <div className='detail'>John Doe</div>
                    <div className='label'>Email</div>
                    <div className='detail'>johndoe@sample.com</div>
                    <div className='label'>Selected Template</div>
                    <img className='img-fluid' src={certificateUrl} alt={`Certificate ${parsedCardId + 1}`} />  
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <div className='cert-list'>
                <div className="search-wrapper d-flex align-items-center">
                  <Form.Group controlId="search" className='w-100'>
                    <div className="password-input position-relative">
                      <Form.Control 
                          type='text'
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Seach Certificate"
                      />
                      <div className='eye-icon position-absolute'>
                          <Image
                              src="https://images.netcomlearning.com/ai-certs/icons/search-icon-transparent.svg"
                              width={20}
                              height={20}
                              alt="Search certificate"
                              className="password-toggle"
                          />
                      </div>
                    </div>
                  </Form.Group>
                  <Button label='Download Certificate' className='golden-download w-50' />
                  <div className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                    <div className='icon' onClick={toggleViewMode}>
                      {isGridView ? (
                        <Image 
                          src="https://images.netcomlearning.com/ai-certs/icons/list.svg"
                          layout='fill'
                          objectFit='contain'
                          alt='List View'
                        />
                      ):(
                        <Image 
                          src="https://images.netcomlearning.com/ai-certs/icons/grid.svg"
                          layout='fill'
                          objectFit='contain'
                          alt='Grid View'
                        />
                      )}
                    </div>
                  </div>
                </div>
                {isGridView ? (
                  <div className='grid-view'>
                    <Row>
                      <Col xs={12} md={4}>
                        <div className='prev-cert-card'>
                          <Form.Check
                            type="checkbox"
                            aria-label="option 1"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <div className='cert-prev' onClick={handleCheckboxClick}>
                            <Image 
                              src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                              layout='fill'
                              objectFit='contain'
                              alt='Certificate 1'
                            />
                          </div>
                          <div className='action-buttons d-flex justify-content-between'>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={handlePrevCert}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              View
                            </span>
                            <span>|</span>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              Download</span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className='prev-cert-card'>
                          <Form.Check
                            type="checkbox"
                            aria-label="option 1"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <div className='cert-prev' onClick={handleCheckboxClick}>
                            <Image 
                              src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                              layout='fill'
                              objectFit='contain'
                              alt='Certificate 1'
                            />
                          </div>
                          <div className='action-buttons d-flex justify-content-between'>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={handlePrevCert}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              View
                            </span>
                            <span>|</span>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              Download</span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className='prev-cert-card'>
                          <Form.Check
                            type="checkbox"
                            aria-label="option 1"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <div className='cert-prev' onClick={handleCheckboxClick}>
                            <Image 
                              src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                              layout='fill'
                              objectFit='contain'
                              alt='Certificate 1'
                            />
                          </div>
                          <div className='action-buttons d-flex justify-content-between'>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={handlePrevCert}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              View
                            </span>
                            <span>|</span>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              Download</span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className='prev-cert-card'>
                          <Form.Check
                            type="checkbox"
                            aria-label="option 1"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <div className='cert-prev' onClick={handleCheckboxClick}>
                            <Image 
                              src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                              layout='fill'
                              objectFit='contain'
                              alt='Certificate 1'
                            />
                          </div>
                          <div className='action-buttons d-flex justify-content-between'>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }} onClick={handlePrevCert}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              View
                            </span>
                            <span>|</span>
                            <span className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                              <Image 
                                src="https://images.netcomlearning.com/ai-certs/icons/download-white-bg.svg"
                                width={16}
                                height={16}
                                alt='View Certificate'
                              />
                              Download</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ):(
                  <div className='list-view-table'>
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>
                            <div className='d-flex align-items-center justify-content-center'>
                              <Form.Check
                                type="checkbox"
                                aria-label="option 1"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                              />
                              <span>S.No</span>
                            </div>
                          </th>
                          <th><span>Issuer Name</span></th>
                          <th><span>Certificate Number</span></th>
                          <th><span>View</span></th>
                          <th><span>Download</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((rowData, index) => (
                          <tr key={index}>
                            <td>
                              <div className='d-flex align-items-center '>
                                <Form.Check
                                  type="checkbox"
                                  aria-label={`option ${index}`}
                                  checked={checkedItems[index] || false}
                                  onChange={(event) => handleCheckboxChange(event, index)}
                                />
                                <span>{index + 1}.</span>
                              </div>
                            </td>
                            <td>{rowData.issuerName}</td>
                            <td>{rowData.certificateNumber}</td>
                            <td>
                              <div className='trigger-icons' onClick={handlePrevCert}>
                                <Image 
                                  src="https://images.netcomlearning.com/ai-certs/icons/eye-bg.svg"
                                  layout='fill'
                                  objectFit='contain'
                                  alt='View certificate'
                                />
                              </div>
                            </td>
                            <td>
                              <div className='trigger-icons'>
                                <Image 
                                  src="https://images.netcomlearning.com/ai-certs/icons/download-bg.svg"
                                  layout='fill'
                                  objectFit='contain'
                                  alt='View certificate'
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}                
              </div>
            </Col>
          </Row>
        </Container>
        <Modal
          size="lg"
          centered
          className='preview-modal'
          show={prevModal}
        >
          <Modal.Body>
            <div className='close-modal' onClick={closePrevCert}>
              <Image 
                src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                layout='fill'
                objectFit='contain'
                alt='Certificate'
              />
            </div>
            <div className='prev-cert'>
              <Image 
                src="https://images.netcomlearning.com/ai-certs/Certificate_template_1.png"
                layout='fill'
                objectFit='contain'
                alt='Certificate'
              />
            </div>
            <div className='text-center'>
              <Button label='Download' className='golden' />
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default DownloadCertificate;
