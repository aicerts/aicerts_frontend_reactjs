import React, { useState, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const SearchAdmin = ({ setFilteredSingleWithCertificates, setFilteredSingleWithoutCertificates, setFilteredBatchCertificatesData, tab,setLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('email'); // Default search parameter
    const [suggestions, setSuggestions] = useState([]);
    const [email, setEmail] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDateInput, setIsDateInput] = useState(false); // Control input type
    const [rawDate, setRawDate] = useState(''); // Store raw date for date picker UI

    useEffect(() => {
        if (searchTerm === "" || isDateInput) {
            setShowSuggestions(false);
        } else {
            setShowSuggestions(true);
        }
    }, [searchTerm, isDateInput]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
        if (storedUser && storedUser.JWTToken) {
            setEmail(storedUser.email);
        }
    }, []);

    // Debounced function to fetch suggestions
    const fetchSuggestions = async (term, criterion) => {
        if (!term.trim() || isDateInput) {
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
        }
    };

    useEffect(() => {
        if (!isDateInput) {
            const debounceFetch = setTimeout(() => {
                fetchSuggestions(searchTerm, searchBy);
            }, 300);

            return () => clearTimeout(debounceFetch);
        }
    }, [searchTerm, searchBy]);

    const handleSearchTermChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setRawDate(value); // Store raw date in 'yyyy-mm-dd' format
        setSearchTerm(formatDate(value)); // Format date for API call
    };

    const handleSearchBySelect = (eventKey) => {
        setSearchBy(eventKey);
        setSearchTerm(''); // Reset search term when search criterion changes
        setSuggestions([]);
        setShowSuggestions(false);

        // Toggle date picker for certain searchBy options
        if (eventKey === 'grantDate' || eventKey === 'expirationDate') {
            setIsDateInput(true);
        } else {
            setIsDateInput(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion); // Set suggestion as search term
        setShowSuggestions(false);
    };

    const filteredData = (data, type) => {
        return data.filter(item => item.type === type);
    };

    const handleSearch = async () => {
        try {
            setLoading(true)

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
            setLoading(false)
            
        } catch (error) {
            console.error('Error during search:', error);
            setLoading(false)

        }
    };

    // Utility function to format date as mm-dd-yyyy for the API call
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="search">
                <div className="search d-flex align-items-start">
                    {/* Search Criteria Dropdown */}
                    <Dropdown onSelect={handleSearchBySelect} className="me-2 golden-dropdown">
    <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="custom-dropdown-toggle">
        Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
    </Dropdown.Toggle>

    <Dropdown.Menu className="custom-dropdown-menu">
        <Dropdown.Item eventKey="certificationNumber">Certification Number</Dropdown.Item>
        <Dropdown.Item eventKey="name">Name</Dropdown.Item>
        <Dropdown.Item eventKey="course">Course</Dropdown.Item>
        <Dropdown.Item eventKey="grantDate">Grant Date</Dropdown.Item>
        <Dropdown.Item eventKey="expirationDate">Expiration Date</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>


                    {/* Search Input and Suggestions */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        {isDateInput ? (
                            <Form.Control
                                type="date"
                                className="search-input-admin"
                                value={rawDate} // Bind rawDate to the date picker
                                onChange={handleDateChange}
                            />
                        ) : (
                            <>
                                <input
                                    type="text"
                                    className="d-none d-md-flex search-input-admin"
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
                            </>
                        )}
                        {!isDateInput && showSuggestions && (
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

                    {/* Search Icon */}
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