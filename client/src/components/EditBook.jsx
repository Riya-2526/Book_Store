import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import '../css/Book.css';

const EditBook = () => {
  const { id } = useParams(); 
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Corrected state variable
  const [success, setSuccess] = useState(''); // Added state for success message
  const [error, setError] = useState(''); // Added state for error message
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios.get('http://localhost:3001/book/book/'+id)
      .then(res => {
        setName(res.data.name);
        setAuthor(res.data.author);
        setImageUrl(res.data.imageUrl);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put('http://localhost:3001/book/book/'+id, {
        name,
        author,
        imageUrl,
      });

      if (res.data.updated) {
        navigate('/books'); 
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="student-form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Edit Book</h2>

        <div className="form-group">
          <label htmlFor="book">Book Name: </label>
          <input
            type="text"
            id="book"
            name="book"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author Name: </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditBook;
