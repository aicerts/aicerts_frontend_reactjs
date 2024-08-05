import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';

const PocCertificates = ({ certificates }) => {
  const [visibleCertificates, setVisibleCertificates] = useState([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0 });

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

  return (
    <div>
      <Row className='d-flex flex-row justify-content-start'>
        {visibleCertificates?.map((url, index) => (
          <Col key={index} className="mb-4 mx-4" style={{ maxWidth: '250px' }}>
            <Image
              src={url}
              width={250}
              height={220}
              objectFit='contain'
              alt={`Certificate ${index + 1}`}
            />
          </Col>
        ))}
        <div ref={ref} style={{ height: 1 }} />
      </Row>
    </div>
  );
};

export default PocCertificates;
