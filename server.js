const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const Database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '1234',
      name: 'Sally',
      email: 'Sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    }
  ]
}

app.get('/', (req, res) => {
  res.send('this is working.')
})

app.post('/signin', (req, res) => {
  if(req.body.email === Database.users[0].email && req.body.password === Database.users[0].password) {
    res.json('success')
  } else {
    res.status(400).json('error logging in')
  }
  
})


app.listen(3000, () => {
  console.log("Working on 3000")
})