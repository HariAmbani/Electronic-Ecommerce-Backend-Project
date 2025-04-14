//productId: { type: String, required: true, unique: true }, //to make productId as unique
//productImage

// productId: { type:String, require: true, unique: true},
// productName: { type:String, require: true},
// productFeatures: { type:String, required:true },
// productPrice: { type:String, require: true},
// ProductImage: { type: String }


//old usermodel
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   fullname: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // optional but recommended
//     lowercase: true,
//     match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
//   },
//   phone: {
//     type: String,
//     required: false,
//     match: [/^\d{10}$/, 'Phone number must be 10 digits']
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   state: {
//     type: String,
//     required: true,
//     enum: [
//       'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//       'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//       'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
//       'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
//       'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
//       'West Bengal'
//     ]
//   },
//   password: {
//     type: String,
//     required: true
//     // You can hash passwords before saving, using bcrypt
//   },

//   role: {
//     type: String,
//     required: false,
//     default:"user",
//     enum: ['seller', 'user', 'admin']
//   },

//   profilePhotoName: {
//     type: String,
//     required: false,
//   },

// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);
// module.exports = User;