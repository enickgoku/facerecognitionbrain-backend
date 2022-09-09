require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createUser, checkAvailability, authenticateUser, authorizeUser, getUser, updateUser } = require('./controllers/users')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/availability', checkAvailability)
app.post('/register', createUser)
app.post('/signin', authorizeUser)
app.get('/profile/:userId', authenticateUser, getUser)
app.put('/image/:userId', authenticateUser, updateUser)

app.use((req, res) => {
  res.status(404).send({ error: `Cannot ${req.method} on ${req.originalUrl}`})
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Running on ${process.env.PORT || 3001}`)
})