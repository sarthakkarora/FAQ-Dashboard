import { useState } from "react";
import PropTypes from "prop-types";
import "./Accordion.css"; // Import the Accordion.css file

export default function Accordion({ question }) {
    const [isOpen, setIsOpen] = useState(question.open);

    const toggle = () => setIsOpen(prevOpen => !prevOpen);

    const styles = {
        backgroundImage: isOpen
            ? `url("./assets/icon-minus.svg")`
            : `url("./assets/icon-plus.svg")`,
    };

    return (
        <div 
            className="single-question" 
            onClick={toggle} 
            role="button" 
            aria-expanded={isOpen} 
            aria-controls={`answer-${question.id}`}
        >
            <div className="question-heading">
                <h2>{question.question}</h2>
                <button 
                    type="button" 
                    style={styles} 
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                ></button>
            </div>
            {isOpen && <p id={`answer-${question.id}`} className="answer">{question.answer}</p>}
        </div>
    );
}

Accordion.propTypes = {
    question: PropTypes.shape({
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
        open: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};
