const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Book = require('../models/book');
const validate = require('../validators/bookValidator');
const auth = require('../middlewares/authorize');

const router = express.Router();

router.post('/postBooks', auth, async(req,res,next)=>{
    try{
        if(!req.user.isAdmin){
            res.status(403).send({message: 'you are not entitled to add the books.'});
        }

        const {error} = validate(req.body);
    
        if(error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }

        let book = await Book.findOne({title: req.body.title});
        if(book){
            console.log(book);
            return res.status(400).send({message: 'Book is already in the catalog.'});
        }

        user = new User(_.pick(req.body,[
            'title',
            'author',
            'field'
        ]));

        await book.save();

        res.status(201).send(user);
    }
    catch(error){
        next(error);
    }
});

router.get('/books', async(req,res,next)=>{
    try{
        let books = await Book.find();

        res.status(200).send(books);
    }
    catch(error){
        console.log(error);
        next(error);
    }    
});

router.get('/book', async(req,res,next)=>{
    try{
        let title = req.query.title
        let book = await Book.findOne({title: title});

        res.status(200).send(book);
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

router.delete('/deleteBook/:id', auth, async(req,res,next)=>{
    try{
        let id = req.params.id;
        let book = await Book.findByIdAndDelete(id);

        if(!book){
            res.status(404).send({message: 'book with the given id not found.'});
        }

        res.status(200).send(book);
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

module.exports = router;