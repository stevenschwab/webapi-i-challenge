// implement API here
// require the express npm module, needs to be added to the project using "npm install express"
const express = require('express');
const cors = require('cors');
// require db file and use its methods to get data
const db = require('./data/db')

// creates an express application using the express module
const server = express();

// global middleware
server.use(express.json())
// enable cors
server.use(cors())

// endpoints
// configures our server to execute a function for every POST request to "/api/users"
// the second argument passed to the .post() method is the "Route Handler Function"
// the route handler function will run on every POST request to "/api/users"
// creates a user using the info sent inside the req body
server.post('/api/users', async (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  const { name, bio } = req.body
  try {
    if (!name || !bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      })
    } else {
      const { id } = await db.insert({ name, bio })
      const user = await db.findById(id)
      res.status(201).json({user})
    }
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the user to the database."
    })
  }
});

// returns an array of all the user objects contained in the db
server.get('/api/users', async (req, res) => {
  try {
    const users = await db.find()
    res.json({users})
  } catch (err) {
    res.status(500).json({
      error: "The users information could not be retrieved."
    })
  }
});

// returns the user object with the specified id
server.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await db.findById(id)
    if (!user) {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
    } else {
      res.json({user})
    }
  } catch (err) {
    res.status(500).json({
      error: "The user information could not be retrieved."
    })
  }
});

// removes the user with the specified id and returns the deleted user
server.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedUserId = await db.remove(id)
    if (!deletedUserId) {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
    } else {
      const deletedUser = await db.findById(deletedUserId)
      res.json({
        message: "User deleted.",
        data: deletedUser,
      })
    }
  } catch (err) {
    res.status(500).json({
      error: "The user could not be removed."
    })
  }
});

// updates the user with the specified id using data from the req body
// returns the modified document, not the original
server.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, bio } = req.body
    if (!name || !bio) {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      })
    } else {
      const updatedUser = await db.update(id, { name, bio })
      if (!updatedUser) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        })
      } else {
        const updatedUser = await db.findById(id)
        res.json({updatedUser})
      }
    }
  } catch (err) {
    res.status(500).json({
      error: "The user information could not be modified."
    })
  }
});

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log('API running on port 8000'));