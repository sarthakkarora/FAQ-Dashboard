import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState("user");
    const [techCode, setTechCode] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState(""); 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const backendUrl = "http://localhost:5000";


    const firstErrorRef = useRef(null);

    useEffect(() => {
        if (firstErrorRef.current) {
            firstErrorRef.current.focus();
        }
    }, [errors]);

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNameChange = (e) => { 
        setName(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required'; 
        if (!email.includes('@')) newErrors.email = 'Invalid email address';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (userType === 'tech' && !techCode) newErrors.techCode = 'Tech Code is required';
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
          setLoading(true);
      
          try {
            const response = await axios.post(`${backendUrl}/users/login`, {
              email,
              password,
            });
            if (response.status === 200 && response.data.message === 'Success') {
              const userType = response.data.userType;
              alert(`Login successful! You are a ${userType}`);  
              onLogin();
            } else {
              alert('Login failed: ' + response.data);
            }
          } catch (error) {
            if (error.response && error.response.data) {
              alert('Error: ' + error.response.data);
            } else {
              alert('Login failed. Please try again.');
            }
          } finally {
            setLoading(false);
          }
        }
      };

    const getPasswordStrength = (password) => {
        if (password.length < 6) return 'Weak';
        if (password.length < 12) return 'Medium';
        return 'Strong';
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <div className="login-main">
            <div className="login-left">
                <img src="/assets/image.jpg" alt="Background" />
            </div>
            <div className="login-right-container">
                <div className="login-logo">
                    <img src="/assets/logo.jpg" alt="Logo" />
                </div>
                <div className="login-center">
                    <h2>Welcome!</h2>
                    <p>Please enter your details to log in</p>
                    <form onSubmit={handleSubmit} noValidate>
                        <label htmlFor="user-type" className="sr-only">User Type</label>
                        <select
                            id="user-type"
                            value={userType}
                            onChange={handleUserTypeChange}
                            className="user-type-select"
                            aria-label="Select user type"
                        >
                            <option value="user">User</option>
                            <option value="tech">Technical Person</option>
                        </select>

                        {userType === "tech" && (
                            <>
                                <label htmlFor="tech-code" className="sr-only">Tech Code</label>
                                <input
                                    id="tech-code"
                                    type="text"
                                    placeholder="Enter Tech Code"
                                    value={techCode}
                                    onChange={(e) => setTechCode(e.target.value)}
                                    className={`tech-code-input ${errors.techCode ? 'error' : ''}`}
                                    aria-label="Tech Code"
                                    aria-required={userType === 'tech'}
                                    aria-invalid={!!errors.techCode}
                                    ref={errors.techCode ? firstErrorRef : null}
                                />
                                {errors.techCode && <p className="error-text" role="alert">{errors.techCode}</p>}
                            </>
                        )}

                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={handleNameChange}
                            aria-label="Name"
                            aria-required="true"
                            aria-invalid={!!errors.name}
                            ref={errors.name ? firstErrorRef : null}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && <p className="error-text" role="alert">{errors.name}</p>}

                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            aria-label="Email"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                            ref={errors.email ? firstErrorRef : null}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <p className="error-text" role="alert">{errors.email}</p>}

                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="pass-input-div">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                aria-label="Password"
                                aria-required="true"
                                aria-invalid={!!errors.password}
                                ref={errors.password ? firstErrorRef : null}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                            />
                            {showPassword ? (
                                <FaEyeSlash
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Hide password"
                                    className="password-toggle"
                                />
                            ) : (
                                <FaEye
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Show password"
                                    className="password-toggle"
                                />
                            )}
                            <div className={`password-strength-meter ${passwordStrength.toLowerCase()}`}>
                                <span>Password Strength: {passwordStrength}</span>
                            </div>
                        </div>
                        {errors.password && <p className="error-text" role="alert">{errors.password}</p>}
                        
                        <div className="login-center-buttons">
    <button type="submit" disabled={loading} className="submit-button">
        {loading ? "Loading..." : "Log In"}
    </button>
</div>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
