import React, { useState, useEffect } from 'react'
import { Image, Modal, Container } from 'react-bootstrap';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminTable = ({ data, tab }) => {
  const [responseData, setResponseData] = useState(null);
  const [expirationDate, setExpirationDate] = useState('');
  const [token, setToken] = useState(null); // State variable for storing token
  const [email, setEmail] = useState(null); // State variable for storing email
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null)
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
  const [selectedRow, setSelectedRow] = useState(null); // State variable for storing the selected row data

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
    } else {
        // If token is not available, redirect to the login page
        router.push("/");
    }
  }, []);


  const fetchData = async (tab) => {
    try {
      setIsLoading(true);
      let queryCode;
      if (tab === 0) {
        queryCode = 8;
      } else if (tab === 1) {
        queryCode = 7;
      } else if (tab === 2) {
        queryCode = 6;
      }

      const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'sdeep.parimi@gmail.com',
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
    try {
      setIsLoading(true);

      let certStatus;

      if (tab === 1) {
        certStatus = 4;
      } else if (tab === 2) {
        certStatus = 3;
      }

      const response = await fetch(`${apiUrl}/api/update_cert_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: 'sdeep.parimi@gmail.com', // Email will be actual user email to track the updates
          certificateNumber: selectedRow.certificateNumber, // Use selected row's certificateNumber
          certStatus: certStatus, // Use expirationDate state
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setResponseData(data);
      setExpirationDate(data.expirationDate);
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = () => {
    if (tab === 1 || tab === 2) {
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
    try {
      setIsLoading(true);

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
          email: 'sdeep.parimi@gmail.com', // Email will be actual user email to track the updates
          certificateNumber: selectedRow.certificateNumber, // Use selected row's certificateNumber
          expirationDate: payloadExpirationDate, // Use expirationDate state
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      setResponseData(data);
      setExpirationDate(data.expirationDate);
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    DateUpdate();
  };

  useEffect(() => {
    fetchData(tab);
}, [tab]);

  const rowHeadName = ((tab) => {
    if (tab === 0) {
      return "New Expiration Date"
    }
    else if (tab === 1) {
      return "Reactive"
    }
    else if (tab === 2) {
      return "Revoke Certification"
    }
  })

  const rowAction = (tab, item) => {
    if (tab === 0) {
      // return <div onClick={() => { setShow(true) }} className='btn-new-date'>Set a new Date</div>;
      return <div onClick={() => { setShow(true); setSelectedRow(item) }} className='btn-new-date'>Set a new Date</div>;
    }
    else if (tab === 1) {
      return (
        <div className='btn-revoke' onClick={() => { handleUpdateClick(); setSelectedRow(item) }}>Reactivate Certificate</div>
      );
    }
    else if (tab === 2) {
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
            <Image
              onClick={() => { setShow(false) }}
              className='cross-icon'
              src="/icons/close-icon.svg"
              layout='fill'
              alt='Loader'
            />

          </Modal.Header>
          <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span className='extend-modal-body-text'>Expiring on 20th March 2024</span>
            <hr style={{ width: "100%", background: "#D5DDEA" }} />
            <span className='extend-modal-body-expire'>New Expiration Date</span>
            <input 
              className='input-date-modal' 
              type='date' 
              value={expirationDate} // Bind value of input field to expirationDate state
              onChange={(e) => setExpirationDate(e.target.value)} // Update expirationDate state when input changes (optional)
            />
            <div className='checkbox-container-modal' >
              <input type="checkbox" id="neverExpires" style={{ marginRight: "5px" }} />
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
            </Modal.Body>
        </Modal>

        <Modal className='loader-modal text-center' show={showErModal} centered>
            <Modal.Body className='p-5'>
                {message &&
                    <>
                        <div className='error-icon'>
                            <Image
                                src="/icons/close.svg"
                                layout='fill'
                                alt='Loader'
                            />
                        </div>
                        <h3 style={{ color: 'red' }}> {message}</h3>
                        <button className='warning'  onClick={() => { setShowErModal(false) }}>Ok</button>
                    </>
                }
            </Modal.Body>
        </Modal>
    </>
  )
}

export default AdminTable
