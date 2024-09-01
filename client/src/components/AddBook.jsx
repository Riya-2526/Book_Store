import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Make sure to import axios if you're using it
import '../css/Book.css';

const AddBook = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Corrected state variable
  const [success, setSuccess] = useState(''); // Added state for success message
  const [error, setError] = useState(''); // Added state for error message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/book/add', {
        name,
        author,
        imageUrl,
      });

      if (response.data.added) {
        navigate('/books'); 
      } else {
        console.log(res)
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="student-form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Add Book</h2>

        <div className="form-group">
          <label htmlFor="book">Book Name: </label>
          <input
            type="text"
            id="book"
            name="book"
            value={name} // Corrected value prop
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author Name: </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author} // Corrected value prop
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="imageUrl" // Corrected name attribute
            value={imageUrl} // Corrected value prop
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button type="submit">Add</button>
      </form>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddBook;
