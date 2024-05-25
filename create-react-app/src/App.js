import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [userDetails, setUserDetails] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/signup', { username, password });
      alert(response.data.message);
    } catch (error) {
      console.error('Signup Error:', error.response.data.error);
      alert('Signup Error: ' + error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      setToken(response.data.token);
      alert('Login Successful!');
    } catch (error) {
      console.error('Login Error:', error.response.data.error);
      alert('Login Error: ' + error.response.data.error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(JSON.stringify(response.data.user));
    } catch (error) {
      console.error('User Details Error:', error.response.data.error);
      alert('User Details Error: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Authentication Demo</h1>
      <div>
        <h2>Signup</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
      </div>
      <div>
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <h2>User Details</h2>
        {token && (
          <div>
            <button onClick={getUserDetails}>Get User Details</button>
            <p>{userDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
