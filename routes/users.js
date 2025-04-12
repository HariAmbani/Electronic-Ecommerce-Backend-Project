const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017/');
const jwt = require('jsonwebtoken')

router.post('/create', async (req, res) => {
  try {
    console.log("Incoming data:", req.body);
    await createUser(req.body);
    const { user,pass } = req.body;
    res.status(200).send('${username} your account created successfully');
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Something went wrong");
  }
});

router.post("/login",async(req,res)=>{
  const {username, password} = req.body;
  const user = await authenticate(username, password)
  if (user){
    const jwtToken = jwt.sign({username:user.username, role:"admin"}, "hello-world", {expiresIn:'1h'}) //here hello-world is the secret key 
    res.json(jwtToken)
  }else{
    res.json("invalid user")
    res.status(403).send("invalid user")
  }

})

async function createUser(data)
{
  await client.connect();
  const database = await client.db("Ecommerce")
  const collection = await database.collection("users")
  await collection.insertOne(data)
  console.log("inserted successfully")
  await client.close()
}

async function authenticate(username,password)
{
  await client.connect();
  const database = await client.db("Ecommerce")
  const collection = await database.collection("users")
  return await collection.findOne({
    username:username,
    password:password
  })
}


module.exports = router;

