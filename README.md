This github repo is for the backend for the Electronic Ecommerce Project

NOTE:
-> to access admin page login with username : admin and password : password

requirement :
-> MongoDB
-> React
-> NodeJS
-> ExpressJS 
-> ensure your device port 3000 and 3015 because that is used by front-end and back-end services respectively

to run the project :
open both the front-end and back-end in seperate terminals like VScode and use command : "npm start" 
then the project starts, backend will connect to your MongoDB and react web application will fireup on your browser

The structure of the backend

models
|--cartModel.js
|--orderModel.js
|--userModel.js
|--productModel.js

routes
|--cartProducts.js
|--user.js
|--orderProducts.js
|--products.js
|--profilePictures (folder)
|--productPictures (folder)

app.js

model folder as the name sugggests it contain MongoDB model and requirements such as fields and it's datatype for all records
routes folder contain all the routes requirements for the ecommerce in part of front-end like homepage, cartpage, admin page and cartpage
this contain the logics for the product creation, product deletion, adding to product to card or order pages as record in DB.

other features
------------------
-> using bcrypt to hash and store user passwords in backend (security is ensured at each phase)
-> many validations are included, admin can create and edit the existing product
-> destination based delivery date is allocated

the plan for version 2 :
-> include quantities for products
-> add another role called sellers
