import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the server
    axios.get('http://localhost:8000/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('Error fetching users', err.message);
      });
  }, []);

  const deleteUser = (id) => {
    axios.delete(`http://localhost:8000/api/users/${id}`)
      .then(res => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(err => {
        console.error('Error deleting user', err.message);
      });
  };

  return (
    <div>
      <h1>Users List</h1>
    </div>
  );
}

export default App;
