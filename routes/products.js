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

    const generateUniqueProductId = () => {
      return Math.floor(Date.now() * 1000 + Math.random() * 1000);
    };

    const uniqueId = generateUniqueProductId();

    // Ensure ID is unique in DB
    const existing = await Product.findOne({ productId: uniqueId });
    if (existing) {
      return res.status(409).json({ message: "Generated productId already exists. Retry submission." });
    }

    const productData = {
      productId: uniqueId,
      name: req.body.name,
      features: parsedFeatures,
      price: Number(req.body.price),
      filename: req.body.filename
    };

    const result = await Product.create(productData);
    res.status(201).json({ message: "Product created successfully", product: result });
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(400).json({ message: "Failed to create product", error: err.message });
  }
});



router.get('/getAllProducts', CheckIsAdmin, async (req,res)=>{
        const productList = await Product.find();
        console.log(productList);
    res.status(201).json(productList)
})

router.post('/createByData', CheckIsAdmin, async(req,res)=>{
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
router.get('/:productId', CheckIsAdmin, async (req,res)=>{
    const abc = req.params.productId
    console.log(abc)
    res.send("get received")
    const result = await Product.find({productId:abc})
    res.json(result)
})

//query parameter
router.get('/getById', CheckIsAdmin, async (req, res) => {
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
router.delete('/delete/:productId', CheckIsAdmin, async (req, res) => {
    const productToDelete = req.params.productId;
    console.log("Product to delete: ", productToDelete);

    try {
        const existingProduct = await Product.findOne({ productId: productToDelete });

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found. Deletion not performed." });
        }

        // Delete the image file associated with the product
        if (existingProduct.filename) {
            const imagePath = path.join(__dirname, 'productPictures', existingProduct.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Image ${existingProduct.filename} deleted successfully.`);
            } else {
                console.warn(`Image ${existingProduct.filename} not found on disk.`);
            }
        }

        // Delete the product from database
        await Product.deleteOne({ productId: productToDelete });
        res.json({ message: "Product and associated image deleted successfully", deletedProductId: productToDelete });

    } catch (error) {
        console.error("Error while deleting product or image:", error);
        res.status(500).json({ message: "Error while deleting product", error });
    }
});


//Update route
router.put('/update/:productId', CheckIsAdmin, upload.single('file'), async (req, res) => {
    const productIdToUpdate = req.params.productId;
    const updateData = req.body;

    try {
        const existingProduct = await Product.findOne({ productId: productIdToUpdate });

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found. Update not performed." });
        }

        // Parse features if it exists in the request
        if (updateData.features && typeof updateData.features === 'string') {
            updateData.features = JSON.parse(updateData.features);
        }

        // Handle new image upload
        if (req.file) {
            // Delete the old image if it exists
            if (existingProduct.filename) {
                const oldImagePath = path.join(__dirname, 'productPictures', existingProduct.filename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log(`Old image ${existingProduct.filename} deleted`);
                }
            }

            // Add new filename to updateData
            updateData.filename = req.file.originalname;
        }

        // Check if updateData is the same as existingProduct
        let isSame = true;
        for (const key in updateData) {
            if (updateData[key] != existingProduct[key]) {
                isSame = false;
                break;
            }
        }

        if (isSame) {
            return res.status(200).json({ message: "No changes detected. Product remains unchanged." });
        }

        // Update in DB
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productIdToUpdate },
            { $set: updateData },
            { new: true }
        );

        res.json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error while updating product", error });
    }
});


module.exports=router