import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from '../../shared/button/button';

interface DateRange {
  from: string;
  to: string;
}

const Settings: React.FC = () => {
  const [issuanceDate, setIssuanceDate] = useState<DateRange>({
    from: '',
    to: '',
  });

  // Adjust the event type to be more generic for React-Bootstrap Form.Control
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof DateRange
  ) => {
    setIssuanceDate({
      ...issuanceDate,
      [field]: e.target.value,
    });
  };

  return (
    <div className="page-bg">
      <div className="position-relative settings-container h-100">
        <div className="settings-title">
          <h3>Settings</h3>
        </div>

        {/* Issuance Report */}
        <div className="org-details mb-5">
          <h2 className="title">Issuance Report</h2>
          <Row className=" d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.from}
                onChange={(e) => handleDateChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.to}
                onChange={(e) => handleDateChange(e, 'to')}
              />
            </Col>
            <Col className='mt-4' xs={12} md={3}>
              <Button label="Download" className="global-btn golden" />
            </Col>
          </Row>
        </div>

        {/* Invoice Report */}
        <div className="org-details">
          <h2 className="title">Invoice Report</h2>
          <Row className=" d-flex align-items-center justify-content-center mt-3">
            <Col xs={12} md={4}>
              <Form.Label className='label-settings'>From:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.from}
                onChange={(e) => handleDateChange(e, 'from')}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label  className='label-settings'>To:</Form.Label>
              <Form.Control
                type="date"
                className="search-input-setting"
                value={issuanceDate.to}
                onChange={(e) => handleDateChange(e, 'to')}
              />
            </Col>
            <Col className='mt-4' xs={12} md={3}>
              <Button label="Download" className="global-btn golden" />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Settings;
