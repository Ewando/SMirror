import React, { useState, useEffect } from 'react';
import './pages.css';
import axios from 'axios';

const Login = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleLoginEmailChange = (e) => setLoginEmail(e.target.value);
    const handleLoginPasswordChange = (e) => setLoginPassword(e.target.value);
    const handleSignupEmailChange = (e) => setSignupEmail(e.target.value);
    const handleSignupPasswordChange = (e) => setSignupPassword(e.target.value);
    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);


    useEffect(() => {
        const savedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const savedUserEmail = localStorage.getItem('userEmail');
        if (savedIsAuthenticated && savedUserEmail) {
            setIsAuthenticated(true);
            setUserEmail(savedUserEmail);
            fetchUserDetails(savedUserEmail);
        }
    }, []);


    const fetchUserDetails = async (email) => {
    
        if (!email) return;
    
        try {
            const response = await axios.get(`http://localhost:3001/user?email=${encodeURIComponent(email)}`);
            if (response.data) {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
            } else {
                throw new Error('No user data returned');
            }
        } catch (error) {
            console.error('Fetching user details failed:', error);
        }
    };
    

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/signup', {
                email: signupEmail,
                password: signupPassword,
                firstName: firstName, 
                lastName: lastName,
            });
    
            if (response.status === 201) {
                alert('Signup successful. You are now logged in.');
                setIsAuthenticated(true);
                setUserEmail(signupEmail);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', signupEmail);
            } else {
                throw new Error('Signup failed');
            }
        } catch (error) {
            alert(error.response ? error.response.data : error.message);
        }
    };
    
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email: loginEmail,
                password: loginPassword,
            });
    
            if (response.status === 200) {
                alert('Login successful.');
                setIsAuthenticated(true);
                setUserEmail(loginEmail);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', loginEmail);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            alert(error.response ? error.response.data : error.message);
        }
    };
    

    const handleSignOut = () => {
        setIsAuthenticated(false);
        setUserEmail('');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
    };

    if (isAuthenticated) {
        return (
            <section className='appSection'>
                <h2>Welcome, {firstName}</h2>
                <button onClick={handleSignOut}>Sign Out</button>
            </section>
        );
    }

    return (
        <section className='appSection'>
            {isLogin ? (
                <form className="userForm" onSubmit={handleLoginSubmit}>
                    <h2>Sign in</h2>
                    <div>
                        <label>Email:</label><br/>
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={handleLoginEmailChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label><br/>
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={handleLoginPasswordChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => setIsLogin(false)}>Need an account? Sign up</button>
                </form>
            ) : (
                <form className="userForm" onSubmit={handleSignupSubmit}>

                    <h2>Create account</h2>
                    <div>
                        <label>First Name:</label><br/>
                        <input
                            type="text"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label><br/>
                        <input
                            type="text"
                            value={lastName}
                            onChange={handleLastNameChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label><br/>
                        <input
                            type="email"
                            value={signupEmail}
                            onChange={handleSignupEmailChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label><br/>
                        <input
                            type="password"
                            value={signupPassword}
                            onChange={handleSignupPasswordChange}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                    <button type="button" onClick={() => setIsLogin(true)}>Already have an account? Login</button>
                </form>
            )}
        </section>
    );
};

export default Login;