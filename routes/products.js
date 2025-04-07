var express = require('express')
const Product = require('../models/ProductsModel')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("welcome to product section , try correct sub-directories to access files")
})

router.get('/get',(req,res)=>{
    res.send("assignment get method called")
})

router.get('/getAllProducts',async (req,res)=>{
        const productList = await Product.find();
        console.log(productList);
    res.status(201).json(productList)
})

router.post('/create', (req,res)=>{
    newProduct={
        'productId':"1",
        'productName':"samsung galaxy book 4",
        'productFeatures':"Intel core 5, 15.6 inch IPS LED, 16GB RAM, 512GB SSD, LAN port",
        'productPrice':"54,990"
    }
    Product.create(newProduct)
    res.send("Product created successfully (POST)")
})

module.exports=router