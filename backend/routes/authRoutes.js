const express = require('express');
const User = require('./../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_secret='12345'

router.get('/',(req,res)=>{
    res.send('Welcome to home page')
})

//SignUp
router.post('/signup',async(req,res)=>{
    const{name,email,password}=req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ error: 'Name, email, and password are required' });
    }

    try{
        const existingUser=await User.findOne({$and:[{name},{email}]})
        if(existingUser){
            res.status(400).send({error:'User with the same name and email already exists'})
        }
        const user=new User({name,email,password})
        await user.save()
        res.status(200).send({message:'User created successfully'})
    }catch(err){
        console.log('Error creating user:', err);
        res.status(400).send({error:'User creation failed'})
    }
})

router.post('/getUser',async(req,res)=>{
    const{name}=req.body;
    try{
        const user=await User.findOne({name})
        if(user){
            res.status(200).send({name:user.name,id:user._id} )
        }else {
            res.status(400).send({ error: 'User not found' });
          }
        } catch (err) {
          res.status(400).send({ error: 'Error fetching user data' });
        }
    })


router.post('/login',async(req,res)=>{
     const{email,password}=req.body
     try{
        const user=await User.findOne({email})
        if(!user||!(await user.comparePassword(password))){
            return res.status(401).send({ error: 'Invalid credentials' });
     }
     const token=jwt.sign({id:user._id},JWT_secret,{expiresIn:'1h'})
     console.log(token)

     res.cookie('token',token,{
        httpOnly:true,
        secure:false,
        sameSite:'Strict'
     })
      res.send({message:'Logged in Successfully'})
    }catch(err){
        console.log(err)
        res.status(500).send({error:'Login failed'})
    }
})  

router.get('/logout',(req,res)=>{
  res.clearCookie('token');
  res.send({message:'Logged out successfully'})
})

router.get('/profile',(req,res)=>{
    
    console.log("Cookies received:", req.cookies)
    const token=req.cookies.token //here token is the name 
    console.log("Profile token:",token)

    if(!token)
        return res.status(401).send({error: 'Unauthorized'})

    jwt.verify(token,JWT_secret,(err,decoded)=>{
        if(err)
            return res.status(403).send({error:'Invalid token'})
    
    res.send({message:'Welcome',id:decoded.id,email:decoded.id})
})
})

module.exports=router