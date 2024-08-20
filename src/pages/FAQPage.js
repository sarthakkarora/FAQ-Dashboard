import React, { useState, useRef, useEffect } from 'react';
import Downshift from 'downshift';
import Accordion from "../components/FAQAccordion";
import { data } from "../utils/data";
import LoginPage from './LoginPage'; 
import './FAQPage.css';
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
    const [userRole, setUserRole] = useState(null);
    const [points, setPoints] = useState(0); 
    const [showLogin, setShowLogin] = useState(true); 
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedPoints = parseInt(localStorage.getItem('points') || '0', 10);
        setUserRole(storedRole || 'user');
        setPoints(storedPoints);
    }, []);

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

    const filteredData = filterData(data, debouncedSearchTerm);

    const handleQuestionClick = (id) => {
        if (userRole === 'technical') {
            const newPoints = points + 10;
            localStorage.setItem('points', newPoints);
            setPoints(newPoints);
        }
    };

    const handleLogin = (role) => {
        setUserRole(role);
        setShowLogin(false);
        localStorage.setItem('userRole', role);
    };

    const isAdmin = userRole === 'admin' || points >= 50;

    return (
        <div className="faq-page">
            {showLogin ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <>
                    <div className="faq-header">
                        <h1 className="faq-heading">Frequently Asked Questions</h1>
                        <p className="faq-subheading">Got questions about ReactJS? Well, we've got you covered :)</p>
                        {userRole !== 'user' && (
                            <div className="faq-actions">
                                {isAdmin && (
                                    <>
                                        <button onClick={() => {/* Implement add FAQ */}}>Add FAQ</button>
                                        <button onClick={() => {/* Implement delete FAQ */}}>Delete FAQ</button>
                                        <button onClick={() => {/* Implement modify FAQ */}}>Modify FAQ</button>
                                    </>
                                )}
                            </div>
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
                                                filterData(data, inputValue).map((item, index) => (
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
                                    onClick={() => handleQuestionClick(singleQuestion.id)}
                                />
                            ))
                        ) : (
                            <p className="faq-no-results">No results found</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FAQPage;
