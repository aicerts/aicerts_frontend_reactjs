import React, { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Button from '../../shared/button/button';
import Image from 'next/image';

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

  const cardContent = [
    {
      title: "FREE",
      subheader: "Best for starters",
      fee: "0",
      limit: "1000",
      rate: "0",
      plan: "Current Plan",
    },
    {
      title: "Basic",
      subheader: "Best for small team",
      fee: "1200",
      limit: "10000",
      rate: "4",
      plan: "Upgrade",
    },
    {
      title: "Intermediate",
      subheader: "Best for mid level org",
      fee: "3750",
      limit: "100000",
      rate: "3.75",
      plan: "Upgrade",
    },
    {
      title: "Advanced",
      subheader: "Best for Big org",
      fee: "7000",
      limit: "2000",
      rate: "3.50",
      plan: "Upgrade",
    },
  ];



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

        {/* QR  Code */}
        <div className="org-details">
          <h2 className="title">QR Code</h2>
          <Row className=" d-flex align-items-center justify-content-center mt-3">
            {/* //? Image not added */}
            <Card>
              <Image
                src={"/assets/img/qr-1.png"}
                width={18}
                height={100}
                alt="QR code"
              /> 
             </Card>
          </Row>
        </div>

        {/* QR Code */}
        <div className="org-details mb-5">
          <h2 className="title">QR Code</h2>
          <Row className=" d-flex align-items-center ml-3">
            <Col className="mt-4" xs={12} md={3}>
              <div className="d-flex flex-row align-items-center">
                <div className="outline-button polygon">
                  {/* <img src="../../assets/img/qr-1.png" alt="asasa" /> */}
                  polygon
                </div>
                <div className="outline-button optimism">
                  {/* <img src="../../assets/img/qr-1.png" alt="asasa" /> */}
                  Optimism
                </div>
              </div>
              {/* <Button className="global-button golden">polygon</Button> */}
              {/* <Button label="polygon" className="global-btn golden" /> */}
            </Col>
          </Row>
        </div>

        {/* App view mode */}
        <div className="org-details mb-5">
          <h2 className="title">App View Mode</h2>
          <Row className=" d-flex align-items-center ml-3">
            <Col className="mt-4" xs={12} md={3}>
              <div className="d-flex flex-row align-items-center">
              <div className="switch-button  light">Light</div>
              <div className="switch-button  dark">Dark</div>
              </div>
              {/* <Button className="global-button golden">polygon</Button> */}
              {/* <Button label="polygon" className="global-btn golden" /> */}
            </Col>
          </Row>
        </div>

        {/* Subscription */}
        <div className="org-details mb-5">
          <h2 className="title">Subscription</h2>
          {/* <Col className=" d-flex flex-wrap align-items-center justify-content-center mt-3"> */}
          <div className="d-flex flex-column  mt-4 ">

          <div className=" d-flex flex-row justify-content-center align-items-center ml-2 ">
            {cardContent.map((card) => (
            <div className="m-2" key={card.title}>
                <Card style={{ width: '14rem', borderRadius: '0px', }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '20px', fontWeight: 'bolder' }}>{card.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '14px', fontWeight: 'bold'}}>{card.subheader}</Card.Subtitle>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>
                       $<b style={{fontSize: '20px', fontWeight: '900', color: 'black' }}>{card.fee}</b> per month
                    </Card.Text>
                    <hr />
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Upto {card.limit} certificates</Card.Text>
                    <Card.Text className="text-muted" style={{fontSize: '12px', fontWeight: 'bold'}}>Upto {card.rate} per certificate</Card.Text>
                  </Card.Body>
                  <Button label={card.plan} className="global-btn golden plan-button"  />
                </Card>
              </div>
            ))}
            </div>

              <div className="last-box">
                  <div>
                    <h3>Custom</h3>
                    <p>Need mor than 200 Certificates? Contact US.</p>
                  </div>
                  <div>
                      <Form.Control
                        type="email" placeholder="Enter your email"
                        className="search-input-setting"
                        // value={issuanceDate.from}
                        // onChange={(e) => handleDateChange(e, "from")}
                      />
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
