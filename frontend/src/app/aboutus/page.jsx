import React from 'react';
import './AboutUs.css'; // Make sure to create and link the CSS file

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>SOPify Browser Extension</h1>
        <p>Your productivity companion for efficient SOP management</p>
      </header>

      <section className="about-content">
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            SOPify is a browser extension designed to help users create, manage, and share Standard Operating Procedures (SOPs) with ease. Whether you are working in a corporate environment or managing a personal project, SOPify streamlines the process and makes documentation effortless.
          </p>
          <p>
            Our mission is to empower individuals and teams to work more efficiently by providing a tool that integrates directly into their browser. With a user-friendly interface and powerful features, SOPify ensures that your SOPs are always accessible and editable in real-time.
          </p>
        </div>

        <div className="about-team">
          <h2>Meet the Team</h2>
          <p>
            We are a team of developers, designers, and productivity enthusiasts who believe in the power of well-structured processes. Our goal is to provide a seamless tool that makes creating and managing SOPs simple, intuitive, and effective.
          </p>
        </div>
      </section>

      <footer className="about-footer">
        <p>&copy; 2025 SOPify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
