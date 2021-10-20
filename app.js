const express = require('express');
const users = require('./routes/users');
const books = require('./routes/books');
const mongoose = require('mongoose');
const result = require('dotenv').config();

if (result.error) {
    throw result.error
  }
  
console.log(result.parsed);

mongoose.connect('mongodb://localhost/getKart')
    .then(()=> console.log('connected to mongo DB'))
    .catch((err)=> console.log(`could not connect to mongo DB... ${err}`));

let app = express();

app.set('port', process.env.PORT);


//body parsing
app.use(express.json());


// route handlers
app.use('/api/users', users);
app.use('/api/books', books);

//error handler
app.use((error,req,res,next)=>{
    res.status(500).json({message: 'Something went wrong.'});
})

app.listen(app.get('port'), ()=>{
    console.log('app is up.')
})