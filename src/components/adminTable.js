import React, { useState, useEffect } from 'react';
import { Modal, Container, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
import DatePicker from 'react-datepicker';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminTable = ({ data, tab, setResponseData, responseData }) => {
  const [expirationDate, setExpirationDate] = useState('');
  const [token, setToken] = useState(null); // State variable for storing token
  const [email, setEmail] = useState(null); // State variable for storing email
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [now, setNow] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    certificateNumber: "",
    name: "",
    course: "",
    grantDate: null, // Use null for Date values
    expirationDate: null, // Use null for Date values
  });
  const [show, setShow] = useState(false);
  const [showErModal, setShowErModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [neverExpires, setNeverExpires] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.JWTToken) {
      setToken(storedUser.JWTToken);
      setEmail(storedUser.email);
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: storedUser.email,
      }));
      fetchData(tab, storedUser.email);
    } else {
      router.push("/");
    }
  }, [tab]);

  const handleClose = () => {
    setShowMessage(false);
    setShow(false);
    setShowErModal(false);
  };

  const fetchData = async (tab, email) => {
    setIsLoading(true);

    try {
      let queryCode;
      if (tab === 1) {
        queryCode = 8;
      } else if (tab === 2) {
        queryCode = 7;
      } else if (tab === 3) {
        queryCode = 6;
      }

      const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          queryCode: queryCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');

      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ReactiveRevokeUpdate = async (tab, item) => {
    setIsLoading(true);
    setNow(10);
    let progressInterval;
    const startProgress = () => {
      progressInterval = setInterval(() => {
        setNow((prev) => {
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 100);
    };

    const stopProgress = () => {
      clearInterval(progressInterval);
      setNow(100); // Progress complete
    };

    startProgress();

    try {
      let certStatus;

      if (tab === 2) {
        certStatus = 4;
      } else if (tab === 3) {
        certStatus = 3;
      }

      const response = await fetch(`${apiUrl}/api/update-cert-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          certificateNumber: item.certificateNumber, // Use the passed item
          certStatus: certStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      await fetchData(tab,email)
      setExpirationDate(data.expirationDate);
      setSuccessMessage("Updated Successfully");
      setShowErModal(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  const DateUpdate = async (item) => {
    setIsLoading(true);
    setNow(10);
    let progressInterval;
    const startProgress = () => {
      progressInterval = setInterval(() => {
        setNow((prev) => {
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 100);
    };

    const stopProgress = () => {
      clearInterval(progressInterval);
      setNow(100); // Progress complete
    };

    startProgress();

    try {
      let payloadExpirationDate = expirationDate;

      if (neverExpires) {
        payloadExpirationDate = "1";
      } else {
        payloadExpirationDate = formatDate(expirationDate);
      }

      const response = await fetch(`${apiUrl}/api/renew-cert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          certificateNumber: item.certificateNumber, // Use the passed item
          expirationDate: payloadExpirationDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data?.message || "Error in Updating certificate");
        setShowErModal(true);

        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      await fetchData(tab,email)
      
      setErrorMessage("");
      setSuccessMessage("Updated Successfully");
      setShowErModal(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      stopProgress();
      setIsLoading(false);
      setExpirationDate("")
    }
  };

  const handleUpdateClick = (tab, item) => {
    setSelectedRow(item); 
  // Set the selected row
    if (tab === 1) {
      setShow(true); // Open the modal for tab 1
    } else {
      ReactiveRevokeUpdate(tab, item); // Handle revoke/reactivate directly
    }
  };

  const handleButtonClick = () => {
    DateUpdate(selectedRow); // Use selectedRow for the API call
    setShow(false); // Close the modal after initiating the API call

  };

  const handleCheckboxChange = (event) => {
    setNeverExpires(event.target.checked);
  };

  const rowHeadName = (tab) => {
    if (tab === 1) {
      return "New Expiration Date";
    } else if (tab === 2) {
      return "Reactive";
    } else if (tab === 3) {
      return "Revoke Certification";
    }
  };

  const rowAction = (tab, item) => {
    const handleClick = () => {
      handleUpdateClick(tab, item);
    };

    let buttonLabel = '';
    if (tab === 1) {
      buttonLabel = 'Set a new Date';
    } else if (tab === 2) {
      buttonLabel = 'Reactivate Certificate';
    } else if (tab === 3) {
      buttonLabel = 'Revoke Certificate';
    }

    return <div onClick={handleClick} className={tab === 1 ? 'btn-new-date' : 'btn-revoke'}>{buttonLabel}</div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };


  return (
    <>
      {/* <Container> */}
        <table className="table table-bordered">
          <thead >
            <tr >
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>S. No.</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Name</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Certificate Number</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }}>Expiration Date</th>
              <th scope="col" style={{ backgroundColor: "#f3f3f3" }} >{rowHeadName(tab)}</th>
            </tr>
          </thead>
          <tbody>
            {responseData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item?.name}</td>
                  <td>{item?.certificateNumber}</td>
                  <td>{formatDate(item.expirationDate)}</td>
                  <td>{rowAction(tab, item)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      {/* </Container> */}

      <Modal style={{ borderRadius: "26px" }} className='extend-modal' show={show} centered>
          <Modal.Header className='extend-modal-header'>
            <span className='extend-modal-header-text'>Set a New Expiration Date</span>
            <div className='close-modal'>
            <Image
              onClick={() => { setShow(false); setExpirationDate("");}}
              className='cross-icon'
              src="/icons/close-icon.svg"
              layout='fill'
              alt='Loader'
            />
            </div>

          </Modal.Header>
          <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            {selectedRow && <span className='extend-modal-body-text'>Expiring on {selectedRow?.expirationDate}</span>}
            <hr style={{ width: "100%", background: "#D5DDEA" }} />
            <span className='extend-modal-body-expire'>New Expiration Date</span>
            <DatePicker
        selected={expirationDate}
        onChange={(date) => setExpirationDate(date)}
        dateFormat="yyyy-MM-dd"
        className='input-date-modal'
        disabled={neverExpires} // Disable datepicker when neverExpires is checked
        minDate={new Date(selectedRow?.expirationDate) || new Date(now)}
      />
              <div className='checkbox-container-modal'>
      <input
        type="checkbox"
        id="neverExpires"
        style={{ marginRight: "5px" }}
        checked={neverExpires} // Set the checked state of the checkbox based on the state variable
        onChange={handleCheckboxChange} // Attach the handler function to onChange event
      />
      <label className='label-modal' htmlFor="neverExpires">Never Expires</label>
    </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="update-button-modal"  onClick={() => { handleButtonClick(); setShow(false);  }}>Update and Issue New Certification</button>
          </Modal.Footer>
      </Modal>

        {/* Loading Modal for API call */}
        <Modal className='loader-modal' show={isLoading} centered>
            <Modal.Body>
                <div className='certificate-loader'>
                    <Image
                        src="/backgrounds/login-loading.gif"
                        layout='fill'
                        alt='Loader'
                    />
                </div>
                <div className='text mt-3'>Please Wait</div>
                {/* <ProgressBar now={now} label={`${now}%`} /> */}
            </Modal.Body>
        </Modal>

        <Modal className='loader-modal text-center' show={showErModal} centered>
            <Modal.Body>
                {message &&
                    <>
                        <div className='error-icon success-image'>
                            <Image
                                src="/icons/invalid-password.gif"
                                layout='fill'
                                alt='Loader'
                            />
                        </div>
                        <div className='text' style={{ color: '#ff5500' }}> {message}</div>
                        <button className='warning'  onClick={() => { setShowErModal(false) }}>Ok</button>
                    </>
                }
            </Modal.Body>
        </Modal>
        <Modal onHide={handleClose} className='loader-modal text-center' show={showErModal} centered>
        <Modal.Body>
          {errorMessage !== '' ? (
            <>
              <div className='error-icon'>
                <Image
                  src="/icons/invalid-password.gif"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#ff5500' }}>{errorMessage}</div>
              <button className='warning' onClick={handleClose}>Ok</button>
            </>
          ) : (
            <>
              <div className='error-icon success-image'>
                <Image
                  src="/icons/check-mark.svg"
                  layout='fill'
                  objectFit='contain'
                  alt='Loader'
                />
              </div>
              <div className='text' style={{ color: '#198754' }}>{successMessage}</div>
              <button className='success' onClick={handleClose}>Ok</button>
            </>
          )}


        </Modal.Body>
      </Modal>
    </>
  )
}

export default AdminTable
