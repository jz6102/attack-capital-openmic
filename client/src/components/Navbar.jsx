// client/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ background: '#333', padding: '1rem' }}>
      <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Bots</Link>
      <Link to="/call-logs" style={{ color: 'white', textDecoration: 'none' }}>Call Logs</Link>
    </nav>
  );
};

export default Navbar;