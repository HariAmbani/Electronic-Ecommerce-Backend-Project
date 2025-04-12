var express = require('express')
const fs = require('fs')
const Product = require('../models/ProductsModel')
const router = express.Router()

const CheckIsAdmin = (req,res,next)=>{
    //check if user is admin
    console.log("admin user verified")
    next()
}

router.get('/',(req,res)=>{
    res.send("welcome to product section , try correct sub-directories to access files")
})

router.get('/get',(req,res)=>{
    res.send("assignment get method called")
})

//request body
router.post('/create',async (req,res)=>{
    console.log(req.body)
    const result = await Product.create(req.body)
    res.send("Product created successfully by postman (POST)")
})

router.get('/getAllProducts',async (req,res)=>{
        const productList = await Product.find();
        console.log(productList);
    res.status(201).json(productList)
})

router.post('/createByData',CheckIsAdmin, async(req,res)=>{
    newProduct={
        'productId':"1",
        'productName':"samsung galaxy book 4",
        'productFeatures':"Intel core 5, 15.6 inch IPS LED, 16GB RAM, 512GB SSD, LAN port",
        'productPrice':"54,990"
    }
    await Product.create(newProduct)
    res.send("Product created successfully (POST)")
})

router.post('/createNext', (req,res)=>{
    newProduct={
        'productId':"2",
        'productName':"sam",
        'productFeatures':"Intelt",
        'productPrice':"990"
    }
    Product.create(newProduct)
    res.send("Product created successfully (POST)")
})

//url parameter
router.get('/:productId',async (req,res)=>{
    const abc = req.params.productId
    comsole.log(abc)
    res.send("get received")
    const result = await Product.find({productId:abc})
    res.join(result)
})

//query parameter
router.get('/getById', async (req, res) => {
    const productId = req.query.productId;
    console.log("Assignment id from getById request: ", productId);
    let result
    try {
        if(productId){
            result = await Product.find({ productId: productId });
            res.json(result);
        }
        else{
            result = await Product.find();
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'product getById Error retrieving product', error });
    }
});

//Delete route
router.delete('/delete/:productId', async (req, res) => {
    const productToDelete = req.params.productId;
    console.log("Product to delete: ", productToDelete);

    try {
        const existingProduct = await Product.findOne({ productId: productToDelete });

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found. Deletion not performed." });
        }

        await Product.deleteOne({ productId: productToDelete });
        res.json({ message: "Product deleted successfully", deletedProductId: productToDelete });
    } catch (error) {
        res.status(500).json({ message: "Error while deleting product", error });
    }
});


//Update route
router.put('/update/:productId', async (req, res) => {
    const productIdToUpdate = req.params.productId;
    const updateData = req.body;

    try {
        const existingProduct = await Product.findOne({ productId: productIdToUpdate });

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found. Update not performed." });
        }

        // Check if the provided update data is the same as the current data
        let isSame = true;
        for (const key in updateData) {
            if (updateData[key] !== existingProduct[key]) {
                isSame = false;
                break;
            }
        }

        if (isSame) {
            return res.status(200).json({ message: "No changes detected. Product remains unchanged." });
        }

        // Proceed to update only changed fields
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productIdToUpdate },
            { $set: updateData },
            { new: true }
        );

        res.json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        res.status(500).json({ message: "Error while updating product", error });
    }
});


module.exports=router