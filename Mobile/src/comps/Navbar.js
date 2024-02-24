import React, { useState } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const getPageTitle = (pathname) => {
        const titleMap = {
            '/': 'Dashboard',
            '/gesture-control': 'Gestures',
            '/modules': 'Modules',
            '/login': 'Profile'
        };
        return titleMap[pathname] || 'Page';
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-brand">MyraMirror <span>// {getPageTitle(location.pathname)}</span></h1>
            <button className="hamburger" onClick={toggleMenu}>
             <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                <Link to="/" className="menu-item" onClick={toggleMenu}>Dashboard</Link>
                <Link to="/gesture-control" className="menu-item" onClick={toggleMenu}>Gestures</Link>
                <Link to="/modules" className="menu-item" onClick={toggleMenu}>Modules</Link>
                <Link to="/login" className="menu-item" onClick={toggleMenu}>Profile</Link>
            </div>
        </nav>
    );
};

export default Navbar;
