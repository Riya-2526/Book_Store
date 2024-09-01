import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteBook = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        console.log("Deleting book with ID:", id); // Debugging line to ensure ID is correct
        axios.delete(`http://localhost:3001/book/book/${id}`)
        .then(res => {
            if (res.data.deleted) {
                navigate('/books');
            }
        })
        .catch(err => console.log(err));
    }, [id, navigate]);

    return null; // Or return some UI if needed
}

export default DeleteBook;
