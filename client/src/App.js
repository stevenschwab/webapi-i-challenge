import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const initialFormValues = {
  name: '',
  bio: '',
};

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormValues);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:8000/api/users/${editId}`, form)
        .then(res => {
          setUsers(users.map(user => user.id === editId ? res.data.updatedUser : user));
          setEditId(null);
          setForm(initialFormValues);
        })
        .catch(err => {
          console.error('Error updating user', err.message);
        })
    } else {
      axios.post('http://localhost:8000/api/users', form)
        .then(res => {
          setUsers([ ...users, res.data.user ]);
          setForm(initialFormValues);
        })
        .catch(err => {
          console.error('Error creating user', err.message);
        })
    }
  };

  const handleEdit = ({ name, bio, id }) => {
    setForm({ name, bio });
    setEditId(id);
  }

  return (
    <div className='container'>
      <h1>Users List</h1>
      <ul className='user-list'>
        {users.map(({id, name, bio}) => (
          <li key={id} className='user-item'>
            <div className='user-info'>
              <strong>{name}</strong> <span>({bio})</span>
            </div>
            <div className='user-buttons'>
              <button className='edit-btn' onClick={() => handleEdit({id, name, bio})}>Edit</button>
              <button className='delete-btn' onClick={() => deleteUser(id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleInputChange}
          className='input-field'
        />
        <input
          type='text'
          name='bio'
          placeholder='Bio'
          value={form.bio}
          onChange={handleInputChange}
          className='input-field'
        />
        <button type='submit' className='submit-btn'>{editId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default App;
