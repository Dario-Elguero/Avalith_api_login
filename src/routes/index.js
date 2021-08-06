require("dotenv").config();
const { Router } = require("express");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { access } = require("fs");
const {SECRET} = process.env

const router = Router();

const users = [{
  "id":"a63ea909-5f17-416f-8948-c3b421aba319",
  "email": "darioelguero@gmail.com",
  "password": "c049cbc3d3752bd2772346d5305fb6f8feb9a948"
},
{
  "id":"5e8bdb81-8b60-455d-80f3-94804087bfc9",
  "email": "admin@gmail.com",
  "password": "e04820372e7f2ebb2d76987433579219b11c2ba5"
},
{
  "id":"1090406d-3d10-43ea-b683-f71fe65edca0",
  "email": "jose@gmail.com",
  "password": "077fe688e3334d2170a3f363b437e7bbc28987b7"
}];

router.get("/date", (req, res, next) => {
  const date = new Date();

  res.status(200).json({
    Date:
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
  });
});

router.get("/greeting", (req, res, next) => {
  const token = req.headers['x-access-token']
  if (token) {
    const decoded = jwt.verify(token,SECRET)
    if (decoded){
      let user = users.find(user => user.id = decoded.id)
      user ? res.status(200).json({ greeting: `Good Moorning ${user.email}`})
      : res.status(404).send('No user found')
    }else{
      res.status(401).json({ Error: "Token Invalid"});
    }

  } else {
    res.status(400).json({ Auth: false, message:"No token" });
  }
});

router.post("/register", (req, res, next) => {
    let { email, password } = req.body;
    const exist = users.find(user => user.email === email)
    
    if(exist){
      return res.send('Usuario ya registrado')
    }
    if (email && password) {
      password = crypto.createHash('sha1').update(password).digest('hex')
      
      const newUser = {
        id : uuidv4(),
        email,
        password
      }
      users.push(newUser)
      res.status(200).json(users)
    }

  });

  router.post("/login", (req, res, next) => {
    let { email, password } = req.body;
    password = crypto.createHash('sha1').update(password).digest('hex')
    const exist = users.find(user => user.email === email && user.password === password)
    if(exist){
      const token = jwt.sign({id:exist.id},SECRET,{
        expiresIn: 60 * 60
      })
      return res.status(200).json({"Auth":true,"Token":token})
    }else{
      return res.status(400).send('User or Password invalid')
    }
    // if (email && password) {
     

    //   const newUser = {
    //     email,
    //     password
    //   }
    //   users.push(newUser)
    //   res.status(200).json(users)
    // }

  });

module.exports = router;
