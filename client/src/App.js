import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialFormValues = {
  name: '',
  bio: '',
};

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormValues);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    axios.get('http://localhost:8000/api/users')
      .then(res => {
        setUsers(res.data.users);
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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map(({id, name}) => (
          <li key={id}>
            {name} <button onClick={() => deleteUser(id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          type='text'
          name='bio'
          placeholder='Bio'
          value={form.bio}
          onChange={handleInputChange}
        />
        <button type='submit'>{editId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default App;
