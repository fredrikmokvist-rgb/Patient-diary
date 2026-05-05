import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Pill, History } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>Översikt</span>
      </NavLink>
      <NavLink to="/log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PlusCircle size={24} />
        <span>Logga</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <History size={24} />
        <span>Historik</span>
      </NavLink>
      <NavLink to="/meds" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Pill size={24} />
        <span>Mediciner</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
