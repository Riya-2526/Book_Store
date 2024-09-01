import React, { useState } from 'react';
import '../css/Login.css'; // Ensure this path is correct
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setRoleVar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      console.log('Submitting login with:', { username, password, role });
      const res = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
        role,
      });

      console.log('Response:', res);

      if (res.data.login) {
        if (res.data.role === 'admin') {
          setRoleVar('admin');
          navigate('/dashboard');
        } else if (res.data.role === 'student') {
          setRoleVar('student');
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <div className='login-page'>
      <div className="login-container">
        <h2>Login</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder='Enter Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <button className='btn-login' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
