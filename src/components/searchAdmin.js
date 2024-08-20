import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const SearchAdmin = ({ setFilteredSingleWithCertificates,setFilteredSingleWithoutCertificates,setFilteredBatchCertificatesData, tab }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('email'); // Default search parameter
    const [suggestions, setSuggestions] = useState([]);
    const [email, setEmail] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      if(searchTerm==""){
        setShowSuggestions(false)
      }else{
        setShowSuggestions(true)
      }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [searchTerm]);


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
    
        if (storedUser && storedUser.JWTToken) {
            setEmail(storedUser.email);
         
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    // Debounced function to fetch suggestions
    const fetchSuggestions = async (term, criterion) => {
        if (!term.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/api/get-filtered-issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email, 
                    input: term,
                    filter: criterion,
                    flag: 1,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setSuggestions(data?.details);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            // setShowSuggestions(false);
        }
    };
    

    useEffect(() => {
        const debounceFetch = setTimeout(() => {
            fetchSuggestions(searchTerm, searchBy);
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, searchBy]);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchBySelect = (eventKey) => {
        setSearchBy(eventKey);
        setSearchTerm(''); // Reset search term when search criterion changes
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion); // Set suggestion as search term
        setShowSuggestions(false);
    };

    const filteredData = (data, type) => {
        const filtered =  data.filter(item => 
            item.type == type
        );
        return filtered;
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/get-filtered-issues`, {
                email: email, 
                input: searchTerm,
                filter: searchBy,
                flag: 2,
            });

            const data = response?.data?.details?.data;

        if (tab === 0) {
            setFilteredSingleWithCertificates(filteredData(data, "withpdf"));
        } else if (tab === 1) {
            setFilteredSingleWithoutCertificates(filteredData(data, "withoutpdf"));

        } else if (tab === 2) {
            setFilteredBatchCertificatesData(filteredData(data, "batch"));
        }
            
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="search">
                <div className="search d-flex align-items-start">
                    {/* Search Criteria Dropdown */}
                    <Dropdown onSelect={handleSearchBySelect} className="me-2">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="certificationNumber">Certification Number</Dropdown.Item>
                            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
                            <Dropdown.Item eventKey="course">Course</Dropdown.Item>
                            <Dropdown.Item eventKey="grantDate">Grant Date</Dropdown.Item>
                            <Dropdown.Item eventKey="expirationDate">Expiration Date</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Search Input and Suggestions */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            className="d-none d-md-flex search-input"
                            placeholder={`Search by ${searchBy}`}
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="d-flex d-md-none search-input"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                     {showSuggestions && (
  <ul className="suggestions-list" style={suggestionsListStyle}>
    {suggestions?.length > 0 ? (
      suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          style={suggestionItemStyle}
          onMouseDown={(e) => e.preventDefault()} // Prevents input blur
        >
          {suggestion}
        </li>
      ))
    ) : (
      <li style={suggestionItemStyle}>No suggestions found</li>
    )}
  </ul>
)}

                    </div>

                    {/* Search Icon for Mobile */}
                    <div className='d-none d-md-flex search-icon-container' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
            <div className='d-flex d-md-none search-icon-container-mobile' onClick={handleSearch}>
              <Image width={10} height={10} src="/icons/search.svg" alt='search' />
            </div>
                  
                </div>
                
            </Form.Group>
        </Form>
    );
};

// Inline styles for suggestions list and items
const suggestionsListStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    maxHeight: '200px',
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const suggestionItemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
};

export default SearchAdmin;
