const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  state: String,
  password: String,        // Hashed password
  plainPassword: String,   // 🔓 Raw password (just for storage)
  profilePhoto: String,
  role: {
    type: String,
    default: "user"        // 👤 Default role
  }
});



// 🔒 Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  // Only hash if the password is new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // You can change salt rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
