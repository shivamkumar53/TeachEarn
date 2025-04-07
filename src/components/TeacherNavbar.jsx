import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { GrLocation } from "react-icons/gr";
import '../assets/css/Navbar.css';
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile, CgMenu, CgClose } from "react-icons/cg";
import { FaChalkboardTeacher, FaUserGraduate, FaSearch, FaBars, FaTimes } from 'react-icons/fa';


const TeacherNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const shouldBeMobile = window.innerWidth <= 900;
      setIsMobileView(shouldBeMobile);
      if (!shouldBeMobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-nav-list-parent">
          <div className="logo">TeachEarn</div>
          
          {/* Desktop Navigation (shows when > 900px) */}
          {!isMobileView && (
            <div className="nav-list-parent">
              <NavLink to="/find-student"><FaUserGraduate className="te-nav-icon" />Find Student</NavLink>
              <NavLink to="/teacher-saved-jobs">Saved Jobs</NavLink>
              <NavLink to="/messages">Messages</NavLink>
              <NavLink to="/post-job-for-teaching">Post Jobs</NavLink>
            </div>
          )}
        </div>

        <div className="right-side-nav">
          {/* Show location only in desktop view */}
          {!isMobileView && <div className="location"><GrLocation size={20} /> New York, NY</div>}
          
          {/* Show profile and notification in desktop view or when mobile menu is open */}
          {(!isMobileView || isMobileMenuOpen) && (
            <div className="profile-setting-notification-parent">
              <NavLink to="/teacher-profile"><CgProfile size={21} /></NavLink>
              <IoMdNotificationsOutline size={23} />
            </div>
          )}

          {/* Mobile Menu Toggle Button (visible when <= 900px) */}
          {isMobileView && (
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <CgClose color='white' size={24} /> : <CgMenu color='white' size={24} />}
            </button>
          )}
        </div>

          {/* Mobile Menu (slides in from right) - includes all navigation elements */}
                {isMobileView && isMobileMenuOpen && (
                  <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                    <div 
                      className="mobile-menu-content" 
                      style={{ width: Math.min(window.innerWidth - 40, 300) + 'px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Include location in mobile menu */}
                      <div className="mobile-location"><GrLocation size={20} /> New York, NY</div>
                      
                      <div id="mobile-nav-list">
                        <NavLink to="/find-student" onClick={toggleMobileMenu}><FaUserGraduate className="te-mobile-link-icon" />Find Student</NavLink>
                        <NavLink to="/student-saved-jobs" onClick={toggleMobileMenu}>Saved Jobs</NavLink>
                        <NavLink to="/messages" onClick={toggleMobileMenu}>Messages</NavLink>
                        <NavLink to="/post-job-for-teaching" onClick={toggleMobileMenu}>Post Jobs</NavLink>
                        <NavLink to="/teacher-profile" onClick={toggleMobileMenu} className="mobile-signup-btn">Profile</NavLink>
                      </div>
                    </div>
                  </div>
                )}
      </nav>
    </header>
  );
};

export default TeacherNavbar;