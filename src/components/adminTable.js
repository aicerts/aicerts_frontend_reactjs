import React, { useState, useEffect } from 'react'
import { Modal, Container, ProgressBar } from 'react-bootstrap';
import Image from 'next/legacy/image';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminTable = ({ data, tab,setResponseData,responseData }) => {
  
  const [expirationDate, setExpirationDate] = useState('');
  const [token, setToken] = useState(null); // State variable for storing token
  const [email, setEmail] = useState(null); // State variable for storing email
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [now, setNow] = useState(0);
  const [formData, setFormData] = useState({ // State variable for form data
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
    // Check if the token is available in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.JWTToken) {
        // If token is available, set it in the state
        setToken(storedUser.JWTToken);
        setEmail(storedUser.email);
        // Set formData.email with stored email
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: storedUser.email,
        }));
        fetchData(tab,storedUser.email);
    } else {
        // If token is not available, redirect to the login page
        router.push("/");
    }
  }, [tab]);



  const handleClose = () => {
    setShowMessage(false);
    setShow(false);
    setShowErModal(false)
};

  const fetchData = async (tab,email) => {
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
          // queryCode: 7, // Reactive certStatus: 4
          // queryCode: 6, // Revocation certStatus: 3
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    } finally {
      setIsLoading(false);
    }
  };

  const ReactiveRevokeUpdate = async (tab) => {
    setIsLoading(true);
    setNow(10)
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
          certificateNumber: selectedRow.certificateNumber, 
          certStatus: certStatus, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      // setResponseData(data);
      setExpirationDate(data.expirationDate);
      setSuccessMessage("Successfully Updated")
setSuccessMessage("Updated Successfully")
      setShowErModal(true)
      // fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  const handleUpdateClick = () => {
    if (tab === 2 || tab === 3) {
      ReactiveRevokeUpdate(tab);
    } else {
      DateUpdate();
    }
  }

  // Function to format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const DateUpdate = async () => {
    setIsLoading(true);
    setNow(10)
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

      let payloadExpirationDate = expirationDate; // Initialize payloadExpirationDate with the expirationDate state value

      // If "Never Expires" checkbox is checked, update payloadExpirationDate to 1
      if (neverExpires) {
        payloadExpirationDate = "1";
      } else {
        // Format expiration date as MM/DD/YYYY if checkbox is not checked
        payloadExpirationDate = formatDate(expirationDate);
      } 

      const response = await fetch(`${apiUrl}/api/renew-cert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email, // Email will be actual user email to track the updates
          certificateNumber: selectedRow.certificateNumber, // Use selected row's certificateNumber
          expirationDate: payloadExpirationDate, // Use expirationDate state
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // setMessage(data?.message || "Error in Updating certificate")
        setErrorMessage(data?.message || "Error in Updating certificate")
        setShowErModal(true)
      
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setErrorMessage("")
      setSuccessMessage("Updated Successfully")
      setShowErModal(true)
      // setResponseData(data);
      // setExpirationDate(data.expirationDate);
      // fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    } finally {
      stopProgress();
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    DateUpdate();
  };

  const handleCheckboxChange = (event) => {
    setNeverExpires(event.target.checked);
  };


  const rowHeadName = ((tab) => {
    if (tab === 1) {
      return "New Expiration Date"
    }
    else if (tab === 2) {
      return "Reactive"
    }
    else if (tab === 3) {
      return "Revoke Certification"
    }
  })

  const rowAction = (tab, item) => {
    if (tab === 1) {
      // return <div onClick={() => { setShow(true) }} className='btn-new-date'>Set a new Date</div>;
      return <div onClick={() => { setShow(true); setSelectedRow(item) }} className='btn-new-date'>Set a new Date</div>;
    }
    else if (tab === 2) {
      return (
        <div className='btn-revoke' onClick={() => { handleUpdateClick(); setSelectedRow(item) }}>Reactivate Certificate</div>
      );
    }
    else if (tab === 3) {
      return <div className='btn-revoke' onClick={() => { handleUpdateClick(); setSelectedRow(item) }}>Revoke Certificate</div>;
    }
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
              onClick={() => { setShow(false) }}
              className='cross-icon'
              src="/icons/close-icon.svg"
              layout='fill'
              alt='Loader'
            />
            </div>

          </Modal.Header>
          <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            {/* <span className='extend-modal-body-text'>Expiring on 20th March 2024</span> */}
            <hr style={{ width: "100%", background: "#D5DDEA" }} />
            <span className='extend-modal-body-expire'>New Expiration Date</span>
            <input 
              className='input-date-modal' 
              type='date' 
              value={expirationDate} // Bind value of input field to expirationDate state
              onChange={(e) => setExpirationDate(e.target.value)} // Update expirationDate state when input changes (optional)
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
            <button className="update-button-modal"  onClick={() => { handleButtonClick(); setShow(false); }}>Update and Issue New Certification</button>
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
                <div className='text mt-3'>Updating admin details</div>
                <ProgressBar now={now} label={`${now}%`} />
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
