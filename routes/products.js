var express = require('express')
const fs = require('fs')
const cors = require('cors');
const multer = require('multer')
const Product = require('../models/ProductsModel')
const router = express.Router()
router.use(cors());

const path = require('path');
const uploadPathOne = path.join(__dirname, 'productPictures');
if (!fs.existsSync(uploadPathOne)) {
  fs.mkdirSync(uploadPathOne);
}
const uploadPathTwo = path.join(__dirname, 'profilePictures');
if (!fs.existsSync(uploadPathTwo)) {
  fs.mkdirSync(uploadPathTwo);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'productPictures')); // ensure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


const upload = multer({storage})

const CheckIsAdmin = (req,res,next)=>{
    //check if user is admin
    console.log("admin user verified")
    next()
}

//request body
router.post('/create', CheckIsAdmin, upload.single('file'), async (req, res) => {
  try {
    const parsedFeatures = JSON.parse(req.body.features);

    const nextProductId = await Product.getNextProductId();

    const productData = {
      productId: nextProductId,
      name: req.body.name,
      features: parsedFeatures,
      price: req.body.price,
      filename: req.body.filename
    };

    const result = await Product.create(productData);
    res.status(201).json({ message: "Product created successfully", product: result });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(400).json({ message: "Failed to create product", error: err.message });
  }
});


router.get('/getAllProducts',async (req,res)=>{
        const productList = await Product.find();
        console.log(productList);
    res.status(201).json(productList)
})

router.post('/createByData',CheckIsAdmin, async(req,res)=>{
    newProduct={
        'productId':"1",
        'Name':"samsung galaxy book 4",
        'Features':["Intel core 5", "15.6 inch IPS LED", "16GB RAM", "512GB SSD", "LAN port"],
        'Price':"54,990"
    }
    await Product.create(newProduct)
    res.send("Product created successfully (POST)")
})

//url parameter
router.get('/:productId',async (req,res)=>{
    const abc = req.params.productId
    console.log(abc)
    res.send("get received")
    const result = await Product.find({productId:abc})
    res.json(result)
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