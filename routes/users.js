const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validate = require('../validators/userValidator');
const hashedPassword = require('../functions/hashPassword');
const auth = require('../middlewares/authorize');

const router = express.Router();

router.post('/signUp', async(req,res,next)=>{
    try{
        const {error} = validate(req.body);
    
        if(error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }

        let user = await User.findOne({$or:[{email : req.body.email}, {contactNumber: req.body.contactNumber}]});         

        if(user){
            console.log(user);
            return res.status(400).send({message:'User already registered'});
        }

        user = new User(_.pick(req.body,[
            'firstName',
            'middleName',
            'lastName', 
            'email', 
            'password', 
            'contactNumber', 
            'isAdmin'
        ]));

        user.password = await hashedPassword(user.password);

        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).status(201).send(_.pick(user, ['_id', 'firstName', 'middleName','lastName','email', 'contactNumber','isAdmin']));
    }
    catch(error){
        console.log(error);
        next(error);
    }
})

router.get('/findAll', auth, async(req,res,next)=>{
    try{
        if(!req.user.isAdmin){
            res.status(403).send({message: 'forbidden to see all teh users'});
        }
        let users = await User.find().select('-password');
        res.status(200).send(users);
    }
    catch (error){
        next(error);
    }
})

router.get('/findYourProfile/:id', auth, async(req,res,next)=>{
    try{
        if(req.user._id != req.params.id){
            res.status(400).send({message: 'Not entitled'})
        }
        let user = await User.findById(req.params.id).select('-password');
        res.status(200).send(user);
    }
    catch(error){
        next(error);
    }
} )

router.patch('/updateName', auth, async(req,res,next)=>{
    try{
        let id = req.user._id;
        let user = await User.findOneAndUpdate(id, {
            $set:{
                firstName: req.body.firstName
            }
        });
        
        res.status(200).send(user);
    }
    catch(error){
        console.log(error);
        next(error);
    }
})

router.delete('/deleteUser/:id', auth, async(req,res,next)=>{
    try{
        if(!req.user.isAdmin){
            res.status(403).send({message: 'You are not allowed to delete a user'});
        }
        let id = req.params.id;
        let user = await User.findByIdAndDelete(id);

        if(!user){
            res.status(404).send({message: 'user with the given id not found.'});
        }

        res.status(200).send(user);
    }
    catch(error){
        console.log(error);
        next(error);
    }
})

module.exports = router;