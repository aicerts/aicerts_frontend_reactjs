import Image from 'next/image';
import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

const GalleryCertificates = () => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [filteredCertificatesArray, setFilteredCertificatesArray] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 11, 11, 11, 11, 11]);

    return (
        <Container fluid className="my-4">
            <Row className='d-flex flex-row justify-content-start'>
                {filteredCertificatesArray && filteredCertificatesArray?.map((detail, index) => (
                    <Col key={index}  className="mb-4">
                        <div className='prev-cert-card'>
                            <div className='cert-prev'>
                                {
                                    isImageLoading ?
                                        <div className="image-container skeleton"></div>
                                        :
                                        <Image
                                            src={"https://html.aicerts.io/Blank%20Certificate_%2304.png"}
                                            width={250}
                                            height={220}
                                            objectFit='contain'
                                            alt={`Certificate`}
                                        />
                                }
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Form.Group controlId={`Certificate`}>
                                    <Form.Check
                                    type="checkbox"
                                    label={"cert1234"}
                                    // label={detail?.certificateNumber && detail?.certificateNumber.toString().length > 5
                                    //     ? `${detail?.certificateNumber.toString().substring(0, 5)}...`
                                    //     : detail?.certificateNumber}
                                    // checked={checkedItems[index] || false}
                                    // onChange={(event) => handleCheckboxChange(event, index)}
                                />
                                </Form.Group>

                                <div className='action-buttons d-flex' style={{ columnGap: "10px" }} >
                                    <span className='d-flex align-items-center' style={{ columnGap: "10px" }}
                                    //onClick={() => handlePrevCert(imageUrlList[index], detail)}
                                    >
                                        <Image
                                            src="https://images.netcomlearning.com/ai-certs/icons/eye-white-bg.svg"
                                            width={16}
                                            height={16}
                                            alt='View Certificate'
                                        />
                                    </span>
                                    <span className='d-flex align-items-center' style={{ columnGap: "10px" }}
                                    //   onClick={() => handleDownloadPDF(detail, apiResponseData?.message, apiResponseData?.polygonLink, apiResponseData?.status)}
                                    >
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
            </Row>
        </Container>
    );
}

export default GalleryCertificates;
