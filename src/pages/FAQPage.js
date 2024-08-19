import React, { useState, useRef, useEffect } from 'react';
import Downshift from 'downshift';
import Accordion from "../components/FAQAccordion";
import { data } from "../utils/data";
import "./FAQPage.css";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState('user'); // Default user role
    const [faqs, setFaqs] = useState(data); // Initial FAQ data
    const searchContainerRef = useRef(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Fetch user role from local storage or another source
        const role = localStorage.getItem('userRole');
        setUserRole(role || 'user');

        // Fetch FAQs from backend if needed
        // Example:
        // fetch('/faqs')
        //     .then(response => response.json())
        //     .then(data => setFaqs(data))
        //     .catch(error => console.error('Error fetching FAQs:', error));
    }, []);

    const handleInputValueChange = (inputValue) => {
        setSearchTerm(inputValue || '');
        setIsDropdownOpen(Boolean(inputValue));
    };

    const handleSearchChange = (selectedItem) => {
        if (selectedItem) {
            setSearchTerm(selectedItem);
            setIsDropdownOpen(false);
        }
    };

    const filterData = (items, term) => {
        const lowercasedTerm = term.toLowerCase();
        return items.filter((item) =>
            item.question.toLowerCase().includes(lowercasedTerm) ||
            item.answer.toLowerCase().includes(lowercasedTerm)
        );
    };

    const filteredData = filterData(faqs, debouncedSearchTerm);

    const handleAddFAQ = () => {
        // Navigate to or display form to add a new FAQ
        console.log('Add FAQ');
    };

    const handleEditFAQ = (faqId) => {
        // Navigate to or display form to edit the FAQ with the given id
        console.log('Edit FAQ:', faqId);
    };

    const handleDeleteFAQ = (faqId) => {
        // Remove FAQ with the given id
        setFaqs(faqs.filter(faq => faq.id !== faqId));
        console.log('Delete FAQ:', faqId);
    };

    return (
        <div className="faq-page">
            <div className="faq-header">
                <h1 className="faq-heading">Frequently Asked Questions</h1>
                <p className="faq-subheading">Got questions about ReactJS? Well, we've got you covered :)</p>
                {userRole === 'tech' && (
                    <button onClick={handleAddFAQ} className="add-faq-button">Add FAQ</button>
                )}
                <Downshift
                    onChange={handleSearchChange}
                    itemToString={(item) => (item ? item.question : '')}
                    inputValue={searchTerm}
                    onInputValueChange={handleInputValueChange}
                >
                    {({
                        getInputProps,
                        getMenuProps,
                        getItemProps,
                        isOpen: downshiftIsOpen,
                        inputValue,
                        highlightedIndex,
                        closeMenu,
                    }) => {
                        const showDropdown = isDropdownOpen && (inputValue || searchTerm);

                        return (
                            <div
                                ref={searchContainerRef}
                                className="faq-search-container"
                            >
                                <input
                                    {...getInputProps({
                                        placeholder: 'Search FAQs...',
                                        className: 'faq-search-input',
                                        onFocus: () => setIsDropdownOpen(true),
                                        onBlur: () => setIsDropdownOpen(false),
                                    })}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace') {
                                            setIsDropdownOpen(true);
                                        }
                                    }}
                                />
                                <ul
                                    {...getMenuProps()}
                                    className={`faq-autosuggest-menu ${showDropdown ? 'open' : 'closed'}`}
                                >
                                    {showDropdown &&
                                        filterData(faqs, inputValue).map((item, index) => (
                                            <li
                                                {...getItemProps({
                                                    key: item.id,
                                                    index,
                                                    item: item.question,
                                                    className: `faq-autosuggest-item ${
                                                        highlightedIndex === index ? 'highlighted' : ''
                                                    }`,
                                                    role: 'option',
                                                    'aria-selected': highlightedIndex === index
                                                })}
                                            >
                                                {item.question}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        );
                    }}
                </Downshift>
            </div>
            <div className="faq-content">
                {filteredData.length > 0 ? (
                    filteredData.map((singleQuestion) => (
                        <Accordion
                            key={singleQuestion.id}
                            question={singleQuestion}
                            onEdit={() => handleEditFAQ(singleQuestion.id)}
                            onDelete={() => handleDeleteFAQ(singleQuestion.id)}
                            isEditable={userRole === 'tech'}
                        />
                    ))
                ) : (
                    <p className="faq-no-results">No results found</p>
                )}
            </div>
        </div>
    );
};

export default FAQPage;
