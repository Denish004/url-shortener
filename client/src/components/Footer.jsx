import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
