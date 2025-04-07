import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const TeachEarnHomepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="te-homepage">
      {/* Navigation */}
      <nav className="te-nav">
        <div className="te-nav-container">
          <div className="te-nav-inner">
            {/* Left side - Logo and main nav */}
            <div className="te-nav-left">
              {/* Logo */}
              <div className="te-logo">
                <span className="te-logo-text">TeachEarn</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="te-desktop-nav">
                <a href="" className="te-nav-link te-nav-link-active">Home</a>
                <a href="/find-student" className="te-nav-link">
                  <FaUserGraduate className="te-nav-icon" /> Find Students
                </a>
                <a href="/find-teacher" className="te-nav-link">
                  <FaChalkboardTeacher className="te-nav-icon" /> Find Teachers
                </a>
              </div>
            </div>
            
            {/* Right side - Auth buttons */}
            <div className="te-auth-buttons">
              <a href="/login" className="te-login-btn">Login</a>
              <a href="/sign-up" className="te-signup-btn">Sign Up</a>
            </div>
            
            {/* Mobile menu button */}
            <div className="te-mobile-menu-btn">
              <button onClick={toggleMobileMenu} className="te-mobile-toggle">
                {mobileMenuOpen ? (
                  <FaTimes className="te-mobile-icon" />
                ) : (
                  <FaBars className="te-mobile-icon" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="te-mobile-nav">
            <div className="te-mobile-nav-content">
              <a href="" className="te-mobile-link te-mobile-link-active">Home</a>
              <a href="/find-student" className="te-mobile-link">
                <FaUserGraduate className="te-mobile-link-icon" /> Find Students
              </a>
              <a href="/find-teacher" className="te-mobile-link">
                <FaChalkboardTeacher className="te-mobile-link-icon" /> Find Teachers
              </a>
              <div className="te-mobile-auth-section">
                <div className="te-mobile-auth-links">
                  <a href="/login" className="te-mobile-auth-link">Login</a>
                  <a href="/sign-up" className="te-mobile-auth-link">Sign Up</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="te-hero">
        <div className="te-hero-container">
          <h1 className="te-hero-title">
            Connect Teachers and Students
          </h1>
          <p className="te-hero-subtitle">
            Whether you need to learn or want to teach, TeachEarn bridges the gap. Find the perfect match for your educational needs.
          </p>
          <div className="te-hero-buttons">
            <a
              href="/sign-up"
              className="te-hero-btn te-hero-btn-primary"
            >
              <FaChalkboardTeacher className="te-hero-btn-icon" /> I'm a Teacher
            </a>
            <a
              href="/sign-up"
              className="te-hero-btn te-hero-btn-secondary"
            >
              <FaUserGraduate className="te-hero-btn-icon" /> I'm a Student
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="te-features">
        <div className="te-features-container">
          <div className="te-features-header">
            <h2 className="te-features-title">Features</h2>
            <p className="te-features-description">
              A better way to connect educators and learners
            </p>
          </div>

          <div className="te-features-grid">
            {/* Feature 1 */}
            <div className="te-feature-card">
              <div className="te-feature-icon-container">
                <FaSearch className="te-feature-icon" />
              </div>
              <div className="te-feature-content">
                <h3 className="te-feature-title">Find What You Need</h3>
                <p className="te-feature-text">
                  Whether you're looking for a teacher or a student, our search tools help you find the perfect match.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="te-feature-card">
              <div className="te-feature-icon-container">
                <FaChalkboardTeacher className="te-feature-icon" />
              </div>
              <div className="te-feature-content">
                <h3 className="te-feature-title">For Teachers</h3>
                <p className="te-feature-text">
                  Create a profile, set your rates, and find students who need your expertise. Earn while you teach.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="te-feature-card">
              <div className="te-feature-icon-container">
                <FaUserGraduate className="te-feature-icon" />
              </div>
              <div className="te-feature-content">
                <h3 className="te-feature-title">For Students</h3>
                <p className="te-feature-text">
                  Post your learning needs and connect with qualified teachers who can help you achieve your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="te-cta">
        <div className="te-cta-container">
          <h2 className="te-cta-title">
            <span className="te-cta-title-line">Ready to get started?</span>
            <span className="te-cta-title-highlight">Join TeachEarn today.</span>
          </h2>
          <div className="te-cta-button-container">
            <a href="/sign-up" className="te-cta-button">
              Sign up for free
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="te-footer">
        <div className="te-footer-container">
          <div className="te-footer-content">
            <div className="te-footer-social">
              <a href="#" className="te-social-link">
                <span className="te-social-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
              <a href="#" className="te-social-link">
                <span className="te-social-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </span>
              </a>
            </div>
            <p className="te-footer-copyright">
              &copy; 2025 TeachEarn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        /* Base Styles */
        .te-homepage {
          min-height: 100vh;
          background-color: #f9fafb;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #374151;
        }
        
        /* Navigation */
        .te-nav {
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        
        .te-nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .te-nav-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }
        
        .te-nav-left {
          display: flex;
          align-items: center;
        }
        
        .te-logo {
          margin-right: 2rem;
        }
        
        .te-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4f46e5;
        }
        
        .te-desktop-nav {
          display: none;
        }
        
        .te-nav-link {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .te-nav-link:hover {
          color: #374151;
          border-color: #d1d5db;
        }
        
        .te-nav-link-active {
          color: #111827;
          border-color: #4f46e5;
        }
        
        .te-nav-icon {
          margin-right: 0.5rem;
        }
        
        .te-auth-buttons {
          display: none;
        }
        
        .te-login-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        
        .te-login-btn:hover {
          color: #4f46e5;
        }
        
        .te-signup-btn {
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          background-color: #4f46e5;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }
        
        .te-signup-btn:hover {
          background-color: #4338ca;
        }
        
        .te-mobile-menu-btn {
          display: flex;
          align-items: center;
        }
        
        .te-mobile-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 0.375rem;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .te-mobile-toggle:hover {
          color: #374151;
          background-color: #f3f4f6;
        }
        
        .te-mobile-icon {
          height: 1.5rem;
          width: 1.5rem;
        }
        
        .te-mobile-nav {
          position: absolute;
          top: 4rem;
          left: 0;
          right: 0;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 40;
        }
        
        .te-mobile-nav-content {
          padding: 0.5rem 0;
        }
        
        .te-mobile-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          border-left: 4px solid transparent;
          transition: all 0.2s ease;
        }
        
        .te-mobile-link:hover {
          color: #374151;
          background-color: #f9fafb;
          border-color: #d1d5db;
        }
        
        .te-mobile-link-active {
          color: #111827;
          background-color: #eef2ff;
          border-color: #4f46e5;
        }
        
        .te-mobile-link-icon {
          margin-right: 0.75rem;
        }
        
        .te-mobile-auth-section {
          border-top: 1px solid #e5e7eb;
          padding: 1rem 0;
          margin-top: 0.5rem;
        }
        
        .te-mobile-auth-links {
          display: flex;
          flex-direction: column;
          padding: 0 1.5rem;
        }
        
        .te-mobile-auth-link {
          padding: 0.75rem 0;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        
        .te-mobile-auth-link:hover {
          color: #4f46e5;
        }
        
        /* Hero Section */
        .te-hero {
          background-color: #4f46e5;
          color: white;
          padding: 4rem 1rem;
        }
        
        .te-hero-container {
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
        }
        
        .te-hero-title {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        
        .te-hero-subtitle {
          font-size: 1.25rem;
          max-width: 48rem;
          margin: 0 auto 2.5rem;
          color: #a5b4fc;
        }
        
        .te-hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }
        
        .te-hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        
        .te-hero-btn-primary {
          background-color: white;
          color: #4f46e5;
        }
        
        .te-hero-btn-primary:hover {
          background-color: #e0e7ff;
        }
        
        .te-hero-btn-secondary {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .te-hero-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .te-hero-btn-icon {
          margin-right: 0.75rem;
        }
        
        /* Features Section */
        .te-features {
          padding: 3rem 1rem;
          background-color: white;
        }
        
        .te-features-container {
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .te-features-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .te-features-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4f46e5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        
        .te-features-description {
          font-size: 1.875rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
        }
        
        .te-features-grid {
          display: grid;
          gap: 2rem;
        }
        
        .te-feature-card {
          background-color: #f9fafb;
          padding: 2rem;
          border-radius: 0.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .te-feature-card:hover {
          transform: translateY(-0.25rem);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .te-feature-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 3rem;
          width: 3rem;
          border-radius: 0.375rem;
          background-color: #4f46e5;
          color: white;
          margin-bottom: 1.5rem;
        }
        
        .te-feature-icon {
          height: 1.5rem;
          width: 1.5rem;
        }
        
        .te-feature-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
        }
        
        .te-feature-text {
          color: #6b7280;
        }
        
        /* CTA Section */
        .te-cta {
          padding: 3rem 1rem;
          background-color: #eef2ff;
        }
        
        .te-cta-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .te-cta-title {
          font-size: 1.875rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 2rem;
        }
        
        .te-cta-title-line {
          display: block;
        }
        
        .te-cta-title-highlight {
          display: block;
          color: #4f46e5;
        }
        
        .te-cta-button {
          display: inline-block;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background-color: #4f46e5;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }
        
        .te-cta-button:hover {
          background-color: #4338ca;
        }
        
        /* Footer */
        .te-footer {
          padding: 3rem 1rem;
          background-color: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .te-footer-container {
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .te-footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .te-footer-social {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .te-social-link {
          color: #6b7280;
          transition: color 0.2s ease;
        }
        
        .te-social-link:hover {
          color: #4f46e5;
        }
        
        .te-social-icon {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          fill: currentColor;
        }
        
        .te-footer-copyright {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        
        /* Media Queries */
        @media (min-width: 640px) {
          .te-hero-title {
            font-size: 3rem;
          }
          
          .te-hero-buttons {
            flex-direction: row;
          }
          
          .te-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 768px) {
          .te-desktop-nav {
            display: flex;
            gap: 1rem;
          }
          
          .te-auth-buttons {
            display: flex;
            align-items: center;
          }
          
          .te-mobile-menu-btn {
            display: none;
          }
          
          .te-hero {
            padding: 6rem 1rem;
          }
          
          .te-hero-title {
            font-size: 3.75rem;
          }
        }
        
        @media (min-width: 1024px) {
          .te-features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .te-cta-container {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
          
          .te-footer-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .te-footer-social {
            margin-bottom: 0;
            order: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TeachEarnHomepage;