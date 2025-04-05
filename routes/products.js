var express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("welcome to product section , try correct sub-directories to access files")
})

router.get('/get',(req,res)=>{
    res.send("assignment get method called")
})

router.get('/getAllProducts',(req,res)=>{
    res.send("get all products method called")
})

module.exports=router