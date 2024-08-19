import React, { useState } from 'react';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <div className="app-container">
            {isLoggedIn ? <FAQPage /> : <LoginPage onLogin={handleLogin} />}
        </div>
    );
};

export default App;
