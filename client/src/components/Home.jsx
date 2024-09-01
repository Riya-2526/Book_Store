import React, { useEffect } from "react";
import axios from "axios"; // Import axios
import "../css/Home.css"; // Fixed import statement

const Home = ({ role }) => {
  return (
    <div className="hero">
      <div className="hero-content">
          {role == "" && (
            <p className="text-content">
              LOGIN first to get access to books.
            </p>
          )}
        <h1 className="hero-text">Book Shop</h1>
        <p className="hero-description">
          Browse the collection of our best top interesting Books. You will
          definitely find what you are looking for.
        </p>   
      </div>
      <div className="hero-image"></div>
    </div>
  );
};

export default Home;
