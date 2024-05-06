import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the server
    axios.get('http://localhost:8000/api/users')
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.error('Error fetching users', err.message)
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
